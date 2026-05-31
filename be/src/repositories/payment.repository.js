const { sql, getPool } = require("../config/db");

const DEFAULT_PLATFORM_FEE_RATE = 0.09;
const DEFAULT_SERVICE_FEE_RATE = 0.02;
const DEFAULT_COMMISSION_FEE_RATE = 0.07;

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

const PaymentRepository = {
  async createTransaction({
    userId,
    amount,
    payMethod,
    orderId,
    txType = "TopUp",
  }) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("Amount", sql.Decimal(18, 2), amount)
      .input("PayMethod", sql.NVarChar(30), payMethod)
      .input("OrderID", sql.Int, orderId || null)
      .input("TxType", sql.NVarChar(30), txType).query(`
        INSERT INTO dbo.PaymentTransactions
          (UserID, Amount, PayMethod, OrderID, TxType, Status)
        OUTPUT INSERTED.*
        VALUES (@UserID, @Amount, @PayMethod, @OrderID, @TxType, 'Pending');
      `);
    return r.recordset[0];
  },

  async markCompleted(payTxId) {
    const pool = await getPool();
    await pool.request().input("PayTxID", sql.Int, payTxId).query(`
        UPDATE dbo.PaymentTransactions
        SET Status = 'Completed', CompletedAt = GETDATE()
        WHERE PayTxID = @PayTxID;
      `);
  },

  async markFailed(payTxId) {
    const pool = await getPool();
    await pool.request().input("PayTxID", sql.Int, payTxId).query(`
        UPDATE dbo.PaymentTransactions
        SET Status = 'Failed', CompletedAt = GETDATE()
        WHERE PayTxID = @PayTxID;
      `);
  },

  async findByOrderId(orderId) {
    const pool = await getPool();
    const r = await pool.request().input("OrderID", sql.Int, orderId).query(`
        SELECT TOP 1 * FROM dbo.PaymentTransactions
        WHERE OrderID = @OrderID
        ORDER BY CreatedAt DESC;
      `);
    return r.recordset[0] || null;
  },

  async findByUser(userId, page = 1, limit = 20) {
    const pool = await getPool();
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.request().input("UserID", sql.Int, userId)
      .query(`
        SELECT COUNT(*) as total FROM dbo.PaymentTransactions
        WHERE UserID = @UserID;
      `);
    const total = countResult.recordset[0]?.total || 0;

    // Get paginated results with order info
    const r = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .input("Offset", sql.Int, offset)
      .input("Limit", sql.Int, limit).query(`
        SELECT 
          pt.PayTxID,
          pt.UserID,
          pt.Amount,
          pt.PayMethod,
          pt.OrderID,
          pt.TxType,
          pt.Status,
          pt.CreatedAt,
          pt.CompletedAt,
          o.OrderType,
          o.LifecycleState,
          COALESCE(u1.UserID, u2.UserID) as RelatedUserID,
          COALESCE(u1.FName + ' ' + u1.LName, u2.FName + ' ' + u2.LName) as RelatedUserName
        FROM dbo.PaymentTransactions pt
        LEFT JOIN dbo.Orders o ON pt.OrderID = o.OrderID
        LEFT JOIN dbo.Users u1 ON o.BuyerID = u1.UserID AND o.BuyerID != @UserID
        LEFT JOIN dbo.Users u2 ON o.SellerID = u2.UserID AND o.SellerID != @UserID
        WHERE pt.UserID = @UserID
        ORDER BY pt.CreatedAt DESC
        OFFSET @Offset ROWS
        FETCH NEXT @Limit ROWS ONLY;
      `);

    return {
      transactions: r.recordset,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  },

  async getSettlementSummary(orderId, tx = null) {
    const pool = tx ? null : await getPool();
    const baseReq = tx ? new sql.Request(tx) : pool.request();
    const orderRes = await baseReq.input("OrderID", sql.Int, orderId).query(`
      SELECT o.*, 
             (SELECT COALESCE(SUM(oi.Quantity * oi.UnitPrice), 0)
              FROM dbo.OrderItems oi
              WHERE oi.OrderID = o.OrderID) AS BuySubtotal
      FROM dbo.Orders o
      WHERE o.OrderID = @OrderID;
    `);
    const order = orderRes.recordset[0];
    if (!order) return null;

    const configReq = tx ? new sql.Request(tx) : pool.request();
    const configRes = await configReq.query(`
      SELECT TOP 1 ConfigID, Rate
      FROM dbo.CommissionConfigs
      WHERE ExpiredAt IS NULL OR ExpiredAt > GETDATE()
      ORDER BY EffectiveAt DESC, ConfigID DESC;
    `);
    const config = configRes.recordset[0] || null;

    const payoutReq = tx ? new sql.Request(tx) : pool.request();
    const payoutRes = await payoutReq.input("OrderID", sql.Int, orderId).query(`
      SELECT TOP 1 PayTxID, Amount, Status, CompletedAt
      FROM dbo.PaymentTransactions
      WHERE OrderID = @OrderID AND TxType = 'Payout'
      ORDER BY CreatedAt DESC;
    `);
    const existingPayout = payoutRes.recordset[0] || null;

    const feeReq = tx ? new sql.Request(tx) : pool.request();
    const feeRes = await feeReq.input("OrderID", sql.Int, orderId).query(`
      SELECT TOP 1 FeeID, CommissionRate, CommissionAmount
      FROM dbo.OrderFees
      WHERE OrderID = @OrderID;
    `);
    const existingFee = feeRes.recordset[0] || null;

    const rentalCharge =
      Number(order.DailyRate || 0) * Number(order.RentDays || 0);
    const depositHeld = Number(order.Deposit || 0);
    const sellerRevenueBase =
      order.OrderType === "Rent" ? rentalCharge : Number(order.BuySubtotal || 0);
    const buyerPaidTotal =
      order.OrderType === "Rent"
        ? rentalCharge + depositHeld
        : Number(order.BuySubtotal || 0);

    const configuredRate = Number(config?.Rate || 0);
    const platformFeeRate =
      configuredRate > 0 ? configuredRate : DEFAULT_PLATFORM_FEE_RATE;
    const serviceFeeRate = DEFAULT_SERVICE_FEE_RATE;
    const commissionFeeRate = DEFAULT_COMMISSION_FEE_RATE;
    const platformFee = roundMoney(sellerRevenueBase * platformFeeRate);
    const sellerPayout = roundMoney(sellerRevenueBase - platformFee);

    return {
      order,
      configId: config?.ConfigID || null,
      platformFeeRate,
      serviceFeeRate,
      commissionFeeRate,
      buyerPaidTotal: roundMoney(buyerPaidTotal),
      sellerRevenueBase: roundMoney(sellerRevenueBase),
      depositHeld: roundMoney(depositHeld),
      platformFee,
      sellerPayout,
      existingPayout,
      existingFee,
      escrowReleased: Boolean(
        existingPayout && existingPayout.Status === "Completed",
      ),
    };
  },

  async releaseEscrowForOrder(orderId) {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);
    await tx.begin();

    try {
      const summary = await this.getSettlementSummary(orderId, tx);
      if (!summary) {
        throw new Error("Order not found for settlement");
      }

      if (summary.escrowReleased) {
        await tx.commit();
        return summary;
      }

      if (!summary.order.IsPaid) {
        throw new Error("Order has not been paid into escrow");
      }

      if (summary.order.LifecycleState !== "Completed") {
        throw new Error("Escrow can only be released for completed orders");
      }

      if (!summary.existingFee) {
        await new sql.Request(tx)
          .input("OrderID", sql.Int, orderId)
          .input("ConfigID", sql.Int, summary.configId || 1)
          .input("CommissionRate", sql.Decimal(5, 4), summary.platformFeeRate)
          .input("CommissionAmount", sql.Decimal(18, 2), summary.platformFee)
          .query(`
            INSERT INTO dbo.OrderFees
              (OrderID, ConfigID, CommissionRate, CommissionAmount)
            VALUES
              (@OrderID, @ConfigID, @CommissionRate, @CommissionAmount);
          `);
      }

      await new sql.Request(tx)
        .input("UserID", sql.Int, summary.order.SellerID)
        .input("Amount", sql.Decimal(18, 2), summary.sellerPayout)
        .input("OrderID", sql.Int, orderId)
        .query(`
          IF COL_LENGTH('dbo.Users', 'Balance') IS NOT NULL
          BEGIN
            IF COL_LENGTH('dbo.Users', 'UpdatedAt') IS NOT NULL
            BEGIN
              UPDATE dbo.Users
              SET Balance = Balance + @Amount, UpdatedAt = GETDATE()
              WHERE UserID = @UserID;
            END
            ELSE
            BEGIN
              UPDATE dbo.Users
              SET Balance = Balance + @Amount
              WHERE UserID = @UserID;
            END
          END

          INSERT INTO dbo.PaymentTransactions
            (UserID, Amount, PayMethod, OrderID, RefID, TxType, Status, CompletedAt)
          VALUES
            (@UserID, @Amount, NULL, @OrderID, @OrderID, 'Payout', 'Completed', GETDATE());
        `);

      await new sql.Request(tx)
        .input("UserID", sql.Int, summary.order.SellerID)
        .input("Amount", sql.Decimal(18, 2), summary.platformFee)
        .input("OrderID", sql.Int, orderId)
        .query(`
          INSERT INTO dbo.PaymentTransactions
            (UserID, Amount, PayMethod, OrderID, RefID, TxType, Status, CompletedAt)
          VALUES
            (@UserID, @Amount, NULL, @OrderID, @OrderID, 'CommissionCollect', 'Completed', GETDATE());
        `);

      await tx.commit();
      return this.getSettlementSummary(orderId);
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  },

  async rewardBuyerCoinsForOrder({ userId, orderId, amount }) {
    const rewardCoins = Math.floor(Number(amount || 0) / 1000);
    if (rewardCoins <= 0) {
      return { rewarded: false, rewardCoins: 0 };
    }

    const pool = await getPool();
    const result = await pool.request()
      .input("UserID", sql.Int, userId)
      .input("OrderID", sql.Int, orderId)
      .input("RewardCoins", sql.Decimal(18, 2), rewardCoins)
      .query(`
        IF OBJECT_ID('dbo.CoinWallets', 'U') IS NULL OR OBJECT_ID('dbo.CoinTransactions', 'U') IS NULL
        BEGIN
          SELECT CAST(0 AS BIT) AS Rewarded, CAST(0 AS INT) AS RewardCoins;
          RETURN;
        END

        DECLARE @WalletID INT;
        SELECT @WalletID = WalletID FROM dbo.CoinWallets WHERE UserID = @UserID;

        IF @WalletID IS NULL
        BEGIN
          INSERT INTO dbo.CoinWallets (UserID, Balance) VALUES (@UserID, 0);
          SELECT @WalletID = WalletID FROM dbo.CoinWallets WHERE UserID = @UserID;
        END

        IF EXISTS (
          SELECT 1
          FROM dbo.CoinTransactions
          WHERE WalletID = @WalletID
            AND RefID = @OrderID
            AND TxType = 'Referral'
            AND Note = N'Thưởng mua đơn hàng'
        )
        BEGIN
          SELECT CAST(0 AS BIT) AS Rewarded, CAST(0 AS INT) AS RewardCoins;
          RETURN;
        END

        UPDATE dbo.CoinWallets
        SET Balance = Balance + @RewardCoins, UpdatedAt = GETDATE()
        WHERE WalletID = @WalletID;

        INSERT INTO dbo.CoinTransactions (WalletID, Amount, TxType, RefID, Note)
        VALUES (@WalletID, @RewardCoins, 'Referral', @OrderID, N'Thưởng mua đơn hàng');

        SELECT CAST(1 AS BIT) AS Rewarded, CAST(@RewardCoins AS INT) AS RewardCoins;
      `);

    return result.recordset[0] || { rewarded: false, rewardCoins: 0 };
  },
};

module.exports = PaymentRepository;
