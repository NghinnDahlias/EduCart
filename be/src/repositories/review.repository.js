const { sql, getPool } = require("../config/db");

/**
 * ReviewRepository — wraps dbo.Reviews.
 *
 * Rating/ReviewsCount on Products are kept in sync automatically
 * by the trg_UpdateProductRating trigger (see sql/triggers.sql).
 */
const ReviewRepository = {
  /**
   * List all reviews for a product, newest first.
   * Includes reviewer's name and avatar for display.
   */
  async findByProduct(productId) {
    const pool = await getPool();
    const r = await pool.request().input("ProductID", sql.Int, productId)
      .query(`
        SELECT
          rv.ReviewID, rv.Rating, rv.Comment, rv.CreatedAt,
          rv.ReviewerID,
          u.FName + ' ' + u.LName AS ReviewerName,
          u.AvatarURL              AS ReviewerAvatarURL
        FROM dbo.Reviews rv
        JOIN dbo.Users u ON u.UserID = rv.ReviewerID
        WHERE rv.ProductID = @ProductID
        ORDER BY rv.CreatedAt DESC;
      `);
    return r.recordset;
  },

  /**
   * Create a review. The DB enforces UNIQUE(OrderID, ProductID) so
   * a buyer can only review each product once per order.
   */
  async create({ reviewerId, productId, orderId, rating, comment }) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input("ReviewerID", sql.Int, reviewerId)
      .input("ProductID", sql.Int, productId)
      .input("OrderID", sql.Int, orderId)
      .input("Rating", sql.TinyInt, rating)
      .input("Comment", sql.NVarChar(sql.MAX), comment || null).query(`
        INSERT INTO dbo.Reviews (ReviewerID, ProductID, OrderID, Rating, Comment)
        OUTPUT INSERTED.*
        VALUES (@ReviewerID, @ProductID, @OrderID, @Rating, @Comment);
      `);
    return r.recordset[0];
  },

  /**
   * Check if a review already exists for this order+product combo.
   */
  async findByOrderAndProduct(orderId, productId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input("OrderID", sql.Int, orderId)
      .input("ProductID", sql.Int, productId).query(`
        SELECT TOP 1 * FROM dbo.Reviews
        WHERE OrderID = @OrderID AND ProductID = @ProductID;
      `);
    return r.recordset[0] || null;
  },
};

module.exports = ReviewRepository;
