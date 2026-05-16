const { sql, getPool } = require('../config/db');

/**
 * Users repository — every method here is the only place in the
 * codebase that issues a SQL statement against dbo.Users / UserUniversity.
 */
const UserRepository = {
  async findByEmail(email) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('Email', sql.VarChar(100), email)
      .query('SELECT TOP 1 * FROM dbo.Users WHERE UserEmail = @Email');
    return r.recordset[0] || null;
  },

  async findById(userId) {
    const pool = await getPool();
    const r = await pool
      .request()
      .input('UserID', sql.Int, userId)
      .query('SELECT * FROM dbo.Users WHERE UserID = @UserID');
    return r.recordset[0] || null;
  },

  async create({ email, passwordHash, fname, lname, mssv, universityId, role = 'Buyer', eduLevel = 'Undergraduate', year = 1 }) {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);
    await tx.begin();
    try {
      const insertUser = await new sql.Request(tx)
        .input('Email', sql.VarChar(100), email)
        .input('Password', sql.VarChar(255), passwordHash)
        .input('FName', sql.NVarChar(50), fname || null)
        .input('LName', sql.NVarChar(50), lname || null)
        .input('MSSV', sql.VarChar(50), mssv || null)
        .input('Role', sql.NVarChar(20), role)
        .input('EduLevel', sql.NVarChar(20), eduLevel)
        .input('Year', sql.TinyInt, year)
        .query(`
          INSERT INTO dbo.Users
            (UserEmail, Password, FName, LName, MSSV, Role, EducationLevel, StudentYear)
          OUTPUT INSERTED.*
          VALUES (@Email, @Password, @FName, @LName, @MSSV, @Role, @EduLevel, @Year);
        `);

      const user = insertUser.recordset[0];

      if (universityId) {
        await new sql.Request(tx)
          .input('UserID', sql.Int, user.UserID)
          .input('UniversityID', sql.Int, universityId)
          .query(`
            INSERT INTO dbo.UserUniversity (UserID, UniversityID, EnrolledAt)
            VALUES (@UserID, @UniversityID, GETDATE());
          `);
      }

      await tx.commit();
      return user;
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  },
};

module.exports = UserRepository;
