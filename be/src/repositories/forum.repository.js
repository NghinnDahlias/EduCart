const { sql, getPool } = require("../config/db");

const ForumRepository = {
  /**
   * List all posts with pagination, joined with author info
   * Returns { posts, total }
   */
  async list({ page = 1, limit = 20, subjectId, search } = {}) {
    const pool = await getPool();
    const req = pool.request();
    const offset = (page - 1) * limit;

    const conditions = [];
    if (subjectId !== undefined) {
      req.input("SubjectID", sql.Int, subjectId);
      conditions.push("p.SubjectID = @SubjectID");
    }
    if (search) {
      req.input("Search", sql.NVarChar(255), `%${search}%`);
      conditions.push("(p.Title LIKE @Search OR p.Content LIKE @Search)");
    }

    req.input("Offset", sql.Int, offset);
    req.input("Limit", sql.Int, limit);

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const r = await req.query(`
      SELECT
        COUNT(*) OVER() AS TotalCount,
        p.PostID, p.AuthorID, p.SubjectID, p.Title, p.Content, p.Tags,
        p.VotesCount, p.CommentsCount, p.ViewCount,
        p.IsActive, p.IsPinned, p.CreatedAt, p.UpdatedAt,
        u.FName, u.LName, u.AvatarURL,
        s.SubjectName
      FROM dbo.Posts p
      LEFT JOIN dbo.Users u ON u.UserID = p.AuthorID
      LEFT JOIN dbo.Subjects s ON s.SubjectID = p.SubjectID
      ${where}
      ORDER BY p.IsPinned DESC, p.CreatedAt DESC
      OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
    `);

    const total = r.recordset.length > 0 ? r.recordset[0].TotalCount : 0;
    const posts = r.recordset.map(({ TotalCount, ...rest }) => rest);
    return { posts, total };
  },

  /**
   * Get post details by ID with all comments
   */
  async findByIdWithComments(postId) {
    const pool = await getPool();

    // Get post details
    const postRes = await pool.request().input("PostID", sql.Int, postId)
      .query(`
        SELECT
          p.PostID, p.AuthorID, p.SubjectID, p.Title, p.Content, p.Tags,
          p.VotesCount, p.CommentsCount, p.ViewCount,
          p.IsActive, p.IsPinned, p.CreatedAt, p.UpdatedAt,
          u.FName, u.LName, u.AvatarURL,
          s.SubjectName
        FROM dbo.Posts p
        LEFT JOIN dbo.Users u ON u.UserID = p.AuthorID
        LEFT JOIN dbo.Subjects s ON s.SubjectID = p.SubjectID
        WHERE p.PostID = @PostID AND p.IsActive = 1
      `);

    if (!postRes.recordset[0]) return null;

    const post = postRes.recordset[0];

    // Get comments (top-level + replies)
    const commentsRes = await pool.request().input("PostID", sql.Int, postId)
      .query(`
        SELECT
          c.CommentID, c.PostID, c.AuthorID, c.ParentCommentID,
          c.Content, c.VotesCount, c.IsActive, c.CreatedAt, c.UpdatedAt,
          u.FName, u.LName, u.AvatarURL
        FROM dbo.Comments c
        LEFT JOIN dbo.Users u ON u.UserID = c.AuthorID
        WHERE c.PostID = @PostID AND c.IsActive = 1
        ORDER BY c.ParentCommentID ASC, c.CreatedAt ASC
      `);

    return {
      ...post,
      comments: commentsRes.recordset,
    };
  },

  /**
   * Create a new post
   */
  async create({ authorId, subjectId, title, content, tags = null }) {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);

    try {
      await tx.begin();

      const postRes = await new sql.Request(tx)
        .input("AuthorID", sql.Int, authorId)
        .input("SubjectID", sql.Int, subjectId || null)
        .input("Title", sql.NVarChar(255), title)
        .input("Content", sql.NVarChar(sql.MAX), content)
        .input("Tags", sql.NVarChar(500), tags).query(`
          INSERT INTO dbo.Posts (AuthorID, SubjectID, Title, Content, Tags)
          OUTPUT INSERTED.*
          VALUES (@AuthorID, @SubjectID, @Title, @Content, @Tags)
        `);

      await tx.commit();
      return postRes.recordset[0];
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  },

  /**
   * Add a comment to a post (can be reply to another comment)
   */
  async addComment({ postId, authorId, content, parentCommentId = null }) {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);

    try {
      await tx.begin();

      // Insert comment
      const commentRes = await new sql.Request(tx)
        .input("PostID", sql.Int, postId)
        .input("AuthorID", sql.Int, authorId)
        .input("Content", sql.NVarChar(sql.MAX), content)
        .input("ParentCommentID", sql.Int, parentCommentId).query(`
          INSERT INTO dbo.Comments (PostID, AuthorID, Content, ParentCommentID)
          OUTPUT INSERTED.*
          VALUES (@PostID, @AuthorID, @Content, @ParentCommentID)
        `);

      // Update CommentsCount on post
      await new sql.Request(tx).input("PostID", sql.Int, postId).query(`
          UPDATE dbo.Posts
          SET CommentsCount = CommentsCount + 1
          WHERE PostID = @PostID
        `);

      await tx.commit();
      return commentRes.recordset[0];
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  },

  /**
   * Increment view count
   */
  async incrementViewCount(postId) {
    const pool = await getPool();
    await pool.request().input("PostID", sql.Int, postId).query(`
        UPDATE dbo.Posts
        SET ViewCount = ViewCount + 1
        WHERE PostID = @PostID
      `);
  },

  /**
   * Vote on a post (upvote: +1, downvote: -1)
   */
  async vote(postId, voteType) {
    const pool = await getPool();
    const voteValue = voteType === "up" ? 1 : -1;
    await pool
      .request()
      .input("PostID", sql.Int, postId)
      .input("VoteValue", sql.Int, voteValue).query(`
        UPDATE dbo.Posts
        SET VotesCount = VotesCount + @VoteValue
        WHERE PostID = @PostID
      `);
  },

  /**
   * Pin/unpin a post (admin only)
   */
  async setPinned(postId, isPinned) {
    const pool = await getPool();
    await pool
      .request()
      .input("PostID", sql.Int, postId)
      .input("IsPinned", sql.Bit, isPinned ? 1 : 0).query(`
        UPDATE dbo.Posts
        SET IsPinned = @IsPinned
        WHERE PostID = @PostID
      `);
  },

  /**
   * Soft delete post (mark as inactive)
   */
  async delete(postId) {
    const pool = await getPool();
    await pool.request().input("PostID", sql.Int, postId).query(`
        UPDATE dbo.Posts
        SET IsActive = 0
        WHERE PostID = @PostID
      `);
  },
};

module.exports = ForumRepository;
