const { sql, getPool } = require("../config/db");

const ProductRepository = {
  async findById(productId) {
    const pool = await getPool();
    const prod = await pool.request().input("ProductID", sql.Int, productId)
      .query(`
        SELECT p.*,
               u.FName + ' ' + u.LName AS SellerName,
               u.AvatarURL AS SellerAvatarURL,
               u.Rating AS SellerRating
        FROM dbo.Products p
        JOIN dbo.Users u ON u.UserID = p.SellerID
        WHERE p.ProductID = @ProductID
      `);
    const imgs = await pool.request().input("ProductID", sql.Int, productId)
      .query(`
        SELECT ImageID, ImageURL, SortOrder
        FROM dbo.ProductImages
        WHERE ProductID = @ProductID
        ORDER BY SortOrder
      `);
    return prod.recordset[0]
      ? { ...prod.recordset[0], images: imgs.recordset }
      : null;
  },

  async findManyByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const pool = await getPool();
    // Build a parameterised IN clause to avoid SQL injection.
    const req = pool.request();
    const placeholders = ids.map((id, i) => {
      req.input(`p${i}`, sql.Int, id);
      return `@p${i}`;
    });
    const r = await req.query(
      `SELECT * FROM dbo.Products WHERE ProductID IN (${placeholders.join(",")})`,
    );
    return r.recordset;
  },

  /**
   * List products with optional filters, joined with thumbnail + location names.
   * Returns { products, total }.
   */
  async list({
    search,
    status,
    page = 1,
    limit = 20,
    universityId,
    facultyId,
    subjectId,
    forRent,
  } = {}) {
    const pool = await getPool();
    const req = pool.request();
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      req.input("Search", sql.NVarChar(255), `%${search}%`);
      conditions.push("(p.Title LIKE @Search OR p.Author LIKE @Search)");
    }
    if (status) {
      req.input("Status", sql.NVarChar(20), status);
      conditions.push("p.Status = @Status");
    }
    if (universityId !== undefined) {
      req.input("UniversityID", sql.Int, universityId);
      conditions.push("p.UniversityID = @UniversityID");
    }
    if (facultyId !== undefined) {
      req.input("FacultyID", sql.Int, facultyId);
      conditions.push("p.FacultyID = @FacultyID");
    }
    if (subjectId !== undefined) {
      req.input("SubjectID", sql.Int, subjectId);
      conditions.push("p.SubjectID = @SubjectID");
    }
    if (forRent !== undefined) {
      req.input("IsForRent", sql.Bit, forRent ? 1 : 0);
      conditions.push("p.IsForRent = @IsForRent");
    }

    req.input("Offset", sql.Int, offset);
    req.input("Limit", sql.Int, limit);

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const r = await req.query(`
      SELECT
        COUNT(*) OVER() AS TotalCount,
        p.ProductID, p.Title, p.Author, p.Price, p.OriginalPrice,
        p.DiscountLabel, p.RentalPrice, p.Condition, p.IsForRent,
        p.Status, p.Rating, p.ReviewsCount, p.ViewCount, p.CreatedAt,
        p.Category, p.Format, p.TermLabel, p.Stock,
        u.FName + ' ' + u.LName AS SellerName,
        s.SubjectName,
        f.FacultyName,
        uni.UName AS UniversityName,
        (
          SELECT TOP 1 pi2.ImageURL
          FROM dbo.ProductImages pi2
          WHERE pi2.ProductID = p.ProductID
          ORDER BY pi2.SortOrder
        ) AS ThumbnailURL
      FROM dbo.Products p
      JOIN dbo.Users u ON u.UserID = p.SellerID
      LEFT JOIN dbo.Subjects s ON s.SubjectID = p.SubjectID
      LEFT JOIN dbo.Faculties f ON f.FacultyID = p.FacultyID
      LEFT JOIN dbo.Universities uni ON uni.UniversityID = p.UniversityID
      ${where}
      ORDER BY p.CreatedAt DESC
      OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;
    `);

    const total = r.recordset.length > 0 ? r.recordset[0].TotalCount : 0;
    const products = r.recordset.map(({ TotalCount, ...rest }) => rest);
    return { products, total };
  },

  /**
   * Insert product + ProductImages rows in one transaction so a
   * partially-saved product is impossible.
   */
  async create({
    sellerId,
    universityId,
    facultyId,
    subjectId,
    title,
    description,
    price,
    isForRent,
    condition = null,
    stock = 1,
    images = [],
    author = null,
    category = null,
    format = null,
    termLabel = null,
    originalPrice = null,
    discountLabel = null,
    rentalPrice = null,
    language = null,
    pages = null,
    publisher = null,
    publishYear = null,
    isbn = null,
  }) {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);
    await tx.begin();
    try {
      const insertProd = await new sql.Request(tx)
        .input("SellerID", sql.Int, sellerId)
        .input("UniversityID", sql.Int, universityId)
        .input("FacultyID", sql.Int, facultyId)
        .input("SubjectID", sql.Int, subjectId)
        .input("Title", sql.NVarChar(255), title)
        .input("Description", sql.NVarChar(sql.MAX), description || null)
        .input("Price", sql.Decimal(18, 2), price)
        .input("Condition", sql.Int, condition)
        .input("IsForRent", sql.Bit, isForRent ? 1 : 0)
        .input("Stock", sql.Int, stock)
        .input("Author", sql.NVarChar(255), author)
        .input("Category", sql.NVarChar(100), category)
        .input("Format", sql.NVarChar(50), format)
        .input("TermLabel", sql.NVarChar(50), termLabel)
        .input("OriginalPrice", sql.Decimal(18, 2), originalPrice)
        .input("DiscountLabel", sql.NVarChar(50), discountLabel)
        .input("RentalPrice", sql.Decimal(18, 2), rentalPrice)
        .input("Language", sql.NVarChar(50), language)
        .input("Pages", sql.Int, pages)
        .input("Publisher", sql.NVarChar(255), publisher)
        .input("PublishYear", sql.SmallInt, publishYear)
        .input("ISBN", sql.VarChar(20), isbn).query(`
          INSERT INTO dbo.Products
            (SellerID, UniversityID, FacultyID, SubjectID, Title, Description,
             Price, Condition, IsForRent, Stock,
             Author, Category, Format, TermLabel, OriginalPrice, DiscountLabel,
             RentalPrice, Language, Pages, Publisher, PublishYear, ISBN)
          OUTPUT INSERTED.*
          VALUES
            (@SellerID, @UniversityID, @FacultyID, @SubjectID, @Title, @Description,
             @Price, @Condition, @IsForRent, @Stock,
             @Author, @Category, @Format, @TermLabel, @OriginalPrice, @DiscountLabel,
             @RentalPrice, @Language, @Pages, @Publisher, @PublishYear, @ISBN);
        `);

      const product = insertProd.recordset[0];

      for (let i = 0; i < images.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new sql.Request(tx)
          .input("ProductID", sql.Int, product.ProductID)
          .input("ImageURL", sql.VarChar(500), images[i])
          .input("SortOrder", sql.TinyInt, i).query(`
            INSERT INTO dbo.ProductImages (ProductID, ImageURL, SortOrder)
            VALUES (@ProductID, @ImageURL, @SortOrder);
          `);
      }

      await tx.commit();
      return product;
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  },

  async decrementStock(productId, qty, isRental = false) {
    const pool = await getPool();
    const newStatus = isRental ? "Pending" : "Sold";
    await pool
      .request()
      .input("ProductID", sql.Int, productId)
      .input("Qty", sql.Int, qty)
      .input("NewStatus", sql.NVarChar(20), newStatus).query(`
        UPDATE dbo.Products
        SET Stock = CASE WHEN Stock - @Qty < 0 THEN 0 ELSE Stock - @Qty END,
            Status = CASE WHEN Stock - @Qty <= 0 THEN @NewStatus ELSE Status END,
            UpdatedAt = GETDATE()
        WHERE ProductID = @ProductID;
      `);
  },

  /**
   * Update product fields. Only seller can update their own product.
   */
  async update({
    productId,
    imageUrls = null,
    title,
    description,
    price,
    stock,
    condition,
    author,
    category,
    format,
    termLabel,
    originalPrice,
    discountLabel,
    rentalPrice,
    language,
    pages,
    publisher,
    publishYear,
    isbn,
  }) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input("ProductID", sql.Int, productId)
      .input("Title", sql.NVarChar(255), title)
      .input("Description", sql.NVarChar(sql.MAX), description)
      .input("Price", sql.Decimal(18, 2), price)
      .input("Stock", sql.Int, stock)
      .input("Condition", sql.Int, condition)
      .input("Author", sql.NVarChar(255), author)
      .input("Category", sql.NVarChar(100), category)
      .input("Format", sql.NVarChar(50), format)
      .input("TermLabel", sql.NVarChar(50), termLabel)
      .input("OriginalPrice", sql.Decimal(18, 2), originalPrice)
      .input("DiscountLabel", sql.NVarChar(50), discountLabel)
      .input("RentalPrice", sql.Decimal(18, 2), rentalPrice)
      .input("Language", sql.NVarChar(50), language)
      .input("Pages", sql.Int, pages)
      .input("Publisher", sql.NVarChar(255), publisher)
      .input("PublishYear", sql.SmallInt, publishYear)
      .input("ISBN", sql.VarChar(20), isbn).query(`
        UPDATE dbo.Products
        SET Title = @Title,
            Description = @Description,
            Price = @Price,
            Stock = @Stock,
            Condition = @Condition,
            Author = @Author,
            Category = @Category,
            Format = @Format,
            TermLabel = @TermLabel,
            OriginalPrice = @OriginalPrice,
            DiscountLabel = @DiscountLabel,
            RentalPrice = @RentalPrice,
            Language = @Language,
            Pages = @Pages,
            Publisher = @Publisher,
            PublishYear = @PublishYear,
            ISBN = @ISBN,
            UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE ProductID = @ProductID;
      `);
    const prod = r.recordset[0];
    if (!prod) return null;

    // If new imageUrls provided, replace existing images in a transaction
    if (imageUrls !== null && imageUrls !== undefined) {
      const tx = new sql.Transaction(pool);
      await tx.begin();
      try {
        await new sql.Request(tx)
          .input("ProductID", sql.Int, productId)
          .query("DELETE FROM dbo.ProductImages WHERE ProductID = @ProductID");
        for (let i = 0; i < imageUrls.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await new sql.Request(tx)
            .input("ProductID", sql.Int, productId)
            .input("ImageURL", sql.VarChar(500), imageUrls[i])
            .input("SortOrder", sql.TinyInt, i)
            .query(
              "INSERT INTO dbo.ProductImages (ProductID, ImageURL, SortOrder) VALUES (@ProductID, @ImageURL, @SortOrder)",
            );
        }
        await tx.commit();
      } catch (err) {
        await tx.rollback();
        throw err;
      }
    }

    // Fetch images
    const imgs = await pool.request().input("ProductID", sql.Int, productId)
      .query(`
        SELECT ImageID, ImageURL, SortOrder
        FROM dbo.ProductImages
        WHERE ProductID = @ProductID
        ORDER BY SortOrder
      `);
    return { ...prod, images: imgs.recordset };
  },

  /**
   * Delete product and associated images (cascade).
   */
  async delete(productId) {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);
    await tx.begin();
    try {
      // Delete images first
      await new sql.Request(tx)
        .input("ProductID", sql.Int, productId)
        .query("DELETE FROM dbo.ProductImages WHERE ProductID = @ProductID");

      // Delete product
      await new sql.Request(tx)
        .input("ProductID", sql.Int, productId)
        .query("DELETE FROM dbo.Products WHERE ProductID = @ProductID");

      await tx.commit();
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  },
};

module.exports = ProductRepository;
