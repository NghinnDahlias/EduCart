const { sql, getPool } = require("../config/db");

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
};

module.exports = PaymentRepository;
