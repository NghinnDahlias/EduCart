const { sql, getPool } = require('../config/db');

const PaymentRepository = {
  async createTransaction({ userId, amount, payMethod, orderId, txType = 'TopUp' }) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('UserID', sql.Int, userId)
      .input('Amount', sql.Decimal(18, 2), amount)
      .input('PayMethod', sql.NVarChar(30), payMethod)
      .input('OrderID', sql.Int, orderId || null)
      .input('TxType', sql.NVarChar(30), txType)
      .query(`
        INSERT INTO dbo.PaymentTransactions
          (UserID, Amount, PayMethod, OrderID, TxType, Status)
        OUTPUT INSERTED.*
        VALUES (@UserID, @Amount, @PayMethod, @OrderID, @TxType, 'Pending');
      `);
    return r.recordset[0];
  },

  async markCompleted(payTxId) {
    const pool = await getPool();
    await pool
      .request()
      .input('PayTxID', sql.Int, payTxId)
      .query(`
        UPDATE dbo.PaymentTransactions
        SET Status = 'Completed', CompletedAt = GETDATE()
        WHERE PayTxID = @PayTxID;
      `);
  },

  async markFailed(payTxId) {
    const pool = await getPool();
    await pool
      .request()
      .input('PayTxID', sql.Int, payTxId)
      .query(`
        UPDATE dbo.PaymentTransactions
        SET Status = 'Failed', CompletedAt = GETDATE()
        WHERE PayTxID = @PayTxID;
      `);
  },

  async findByOrderId(orderId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('OrderID', sql.Int, orderId)
      .query(`
        SELECT TOP 1 * FROM dbo.PaymentTransactions
        WHERE OrderID = @OrderID
        ORDER BY CreatedAt DESC;
      `);
    return r.recordset[0] || null;
  },
};

module.exports = PaymentRepository;
