const { sql, getPool } = require('../config/db');

const OrderRepository = {
  async findById(orderId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('OrderID', sql.Int, orderId)
      .query('SELECT * FROM dbo.Orders WHERE OrderID = @OrderID');
    return r.recordset[0] || null;
  },

  async findItemsByOrderId(orderId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('OrderID', sql.Int, orderId)
      .query('SELECT * FROM dbo.OrderItems WHERE OrderID = @OrderID');
    return r.recordset;
  },

  /**
   * Persist the order + its line items atomically. Accepts the
   * payload built by an OrderFactory product (BuyOrder / RentOrder).
   */
  async createWithItems(payload) {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);
    await tx.begin();
    try {
      const orderRes = await new sql.Request(tx)
        .input('BuyerID', sql.Int, payload.buyerId)
        .input('SellerID', sql.Int, payload.sellerId)
        .input('OrderType', sql.VarChar(10), payload.orderType)
        .input('LifecycleState', sql.NVarChar(30), payload.lifecycleState)
        .input('Note', sql.NVarChar(500), payload.note)
        .input('RentStartDate', sql.Date, payload.rentStartDate)
        .input('RentEndDate', sql.Date, payload.rentEndDate)
        .input('RentDays', sql.Int, payload.rentDays)
        .input('DailyRate', sql.Decimal(18, 2), payload.dailyRate)
        .input('Deposit', sql.Decimal(18, 2), payload.deposit)
        .query(`
          INSERT INTO dbo.Orders
            (BuyerID, SellerID, OrderType, LifecycleState, Note,
             RentStartDate, RentEndDate, RentDays, DailyRate, Deposit)
          OUTPUT INSERTED.*
          VALUES
            (@BuyerID, @SellerID, @OrderType, @LifecycleState, @Note,
             @RentStartDate, @RentEndDate, @RentDays, @DailyRate, @Deposit);
        `);
      const order = orderRes.recordset[0];

      for (const item of payload.items) {
        // eslint-disable-next-line no-await-in-loop
        await new sql.Request(tx)
          .input('OrderID', sql.Int, order.OrderID)
          .input('ProductID', sql.Int, item.productId)
          .input('Quantity', sql.Int, item.quantity)
          .input('UnitPrice', sql.Decimal(18, 2), item.unitPrice)
          .query(`
            INSERT INTO dbo.OrderItems (OrderID, ProductID, Quantity, UnitPrice)
            VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice);
          `);
      }

      await tx.commit();
      return order;
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  },

  async updateLifecycleState(orderId, newState, { isPaid, paidType } = {}) {
    const pool = await getPool();
    const req = pool
      .request()
      .input('OrderID', sql.Int, orderId)
      .input('LifecycleState', sql.NVarChar(30), newState);

    const sets = ['LifecycleState = @LifecycleState', 'UpdatedAt = GETDATE()'];
    if (typeof isPaid === 'boolean') {
      req.input('IsPaid', sql.Bit, isPaid ? 1 : 0);
      sets.push('IsPaid = @IsPaid');
    }
    if (paidType) {
      req.input('PaidType', sql.NVarChar(30), paidType);
      sets.push('PaidType = @PaidType');
    }

    await req.query(`UPDATE dbo.Orders SET ${sets.join(', ')} WHERE OrderID = @OrderID`);
  },
};

module.exports = OrderRepository;
