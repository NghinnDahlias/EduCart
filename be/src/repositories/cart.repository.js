const { sql, getPool } = require('../config/db');

const CartRepository = {
  async findByUser(userId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('UserID', sql.Int, userId)
      .query(`
        SELECT ci.CartItemID, ci.ProductID, ci.SavedForLater, ci.AddedAt,
               p.Title, p.Author, p.Price, p.OriginalPrice, p.RentalPrice,
               p.IsForRent, p.Status, p.Condition, p.Stock,
               (SELECT TOP 1 ImageURL FROM dbo.ProductImages
                WHERE ProductID = p.ProductID ORDER BY SortOrder) AS ThumbnailURL
        FROM dbo.CartItems ci
        JOIN dbo.Products p ON p.ProductID = ci.ProductID
        WHERE ci.UserID = @UserID AND ci.SavedForLater = 0
        ORDER BY ci.AddedAt DESC
      `);
    return r.recordset;
  },

  async add(userId, productId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('UserID', sql.Int, userId)
      .input('ProductID', sql.Int, productId)
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM dbo.CartItems WHERE UserID = @UserID AND ProductID = @ProductID
        )
          INSERT INTO dbo.CartItems (UserID, ProductID) VALUES (@UserID, @ProductID);
        SELECT ci.CartItemID, ci.ProductID, ci.SavedForLater, ci.AddedAt
        FROM dbo.CartItems ci
        WHERE ci.UserID = @UserID AND ci.ProductID = @ProductID;
      `);
    return r.recordset[0];
  },

  async remove(userId, productId) {
    const pool = await getPool();
    await pool
      .request()
      .input('UserID', sql.Int, userId)
      .input('ProductID', sql.Int, productId)
      .query('DELETE FROM dbo.CartItems WHERE UserID = @UserID AND ProductID = @ProductID');
  },
};

module.exports = CartRepository;
