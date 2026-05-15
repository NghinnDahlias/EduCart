const { sql, getPool } = require('../config/db');

const MessageRepository = {
  async getConversations(userId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('UserID', sql.Int, userId)
      .query(`
        WITH ranked AS (
          SELECT m.SenderID, m.ReceiverID, m.Content, m.SentAt, m.IsRead,
                 ROW_NUMBER() OVER (
                   PARTITION BY CASE
                     WHEN m.SenderID = @UserID THEN m.ReceiverID
                     ELSE m.SenderID
                   END
                   ORDER BY m.SentAt DESC
                 ) AS rn,
                 CASE
                   WHEN m.SenderID = @UserID THEN m.ReceiverID
                   ELSE m.SenderID
                 END AS OtherUserID
          FROM dbo.Messages m
          WHERE m.SenderID = @UserID OR m.ReceiverID = @UserID
        )
        SELECT r.OtherUserID, r.Content AS LastMessage, r.SentAt AS LastSentAt,
               r.IsRead, u.FName, u.LName, u.AvatarURL
        FROM ranked r
        JOIN dbo.Users u ON u.UserID = r.OtherUserID
        WHERE r.rn = 1
        ORDER BY r.SentAt DESC
      `);
    return r.recordset;
  },

  async getMessages(userId, otherUserId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('UserID', sql.Int, userId)
      .input('OtherID', sql.Int, otherUserId)
      .query(`
        SELECT m.MessageID, m.SenderID, m.ReceiverID, m.Content, m.IsRead, m.SentAt, m.ProductID
        FROM dbo.Messages m
        WHERE (m.SenderID = @UserID AND m.ReceiverID = @OtherID)
           OR (m.SenderID = @OtherID AND m.ReceiverID = @UserID)
        ORDER BY m.SentAt ASC
      `);
    // Mark received messages as read
    await pool
      .request()
      .input('UserID', sql.Int, userId)
      .input('OtherID', sql.Int, otherUserId)
      .query(`
        UPDATE dbo.Messages
        SET IsRead = 1
        WHERE ReceiverID = @UserID AND SenderID = @OtherID AND IsRead = 0
      `);
    return r.recordset;
  },

  async send({ senderId, receiverId, content, productId }) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('SenderID', sql.Int, senderId)
      .input('ReceiverID', sql.Int, receiverId)
      .input('Content', sql.NVarChar(sql.MAX), content)
      .input('ProductID', sql.Int, productId || null)
      .query(`
        INSERT INTO dbo.Messages (SenderID, ReceiverID, Content, ProductID)
        OUTPUT INSERTED.MessageID, INSERTED.SenderID, INSERTED.ReceiverID,
               INSERTED.Content, INSERTED.IsRead, INSERTED.SentAt, INSERTED.ProductID
        VALUES (@SenderID, @ReceiverID, @Content, @ProductID)
      `);
    return r.recordset[0];
  },
};

module.exports = MessageRepository;
