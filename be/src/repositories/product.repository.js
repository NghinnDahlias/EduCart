const { sql, getPool } = require('../config/db');

const ProductRepository = {
  async findById(productId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('ProductID', sql.Int, productId)
      .query('SELECT * FROM dbo.Products WHERE ProductID = @ProductID');
    return r.recordset[0] || null;
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
      `SELECT * FROM dbo.Products WHERE ProductID IN (${placeholders.join(',')})`,
    );
    return r.recordset;
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
  }) {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);
    await tx.begin();
    try {
      const insertProd = await new sql.Request(tx)
        .input('SellerID', sql.Int, sellerId)
        .input('UniversityID', sql.Int, universityId)
        .input('FacultyID', sql.Int, facultyId)
        .input('SubjectID', sql.Int, subjectId)
        .input('Title', sql.NVarChar(255), title)
        .input('Description', sql.NVarChar(sql.MAX), description || null)
        .input('Price', sql.Decimal(18, 2), price)
        .input('Condition', sql.Int, condition)
        .input('IsForRent', sql.Bit, isForRent ? 1 : 0)
        .input('Stock', sql.Int, stock)
        .query(`
          INSERT INTO dbo.Products
            (SellerID, UniversityID, FacultyID, SubjectID, Title, Description,
             Price, Condition, IsForRent, Stock)
          OUTPUT INSERTED.*
          VALUES
            (@SellerID, @UniversityID, @FacultyID, @SubjectID, @Title, @Description,
             @Price, @Condition, @IsForRent, @Stock);
        `);

      const product = insertProd.recordset[0];

      for (let i = 0; i < images.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new sql.Request(tx)
          .input('ProductID', sql.Int, product.ProductID)
          .input('ImageURL', sql.VarChar(500), images[i])
          .input('SortOrder', sql.TinyInt, i)
          .query(`
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
    const newStatus = isRental ? 'Pending' : 'Sold';
    await pool
      .request()
      .input('ProductID', sql.Int, productId)
      .input('Qty', sql.Int, qty)
      .input('NewStatus', sql.NVarChar(20), newStatus)
      .query(`
        UPDATE dbo.Products
        SET Stock = CASE WHEN Stock - @Qty < 0 THEN 0 ELSE Stock - @Qty END,
            Status = CASE WHEN Stock - @Qty <= 0 THEN @NewStatus ELSE Status END,
            UpdatedAt = GETDATE()
        WHERE ProductID = @ProductID;
      `);
  },
};

module.exports = ProductRepository;
