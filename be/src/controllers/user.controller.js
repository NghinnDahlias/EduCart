const asyncHandler = require('../utils/asyncHandler');
const { repositories } = require('../container');
const { sql, getPool } = require('../config/db');

const getMe = asyncHandler(async (req, res) => {
  const user = await repositories.userRepository.findById(req.user.id);
  if (!user) return res.status(404).json({ ok: false, message: 'User not found' });
  const { Password, ...safe } = user;
  res.json({ ok: true, user: safe });
});

const updateMe = asyncHandler(async (req, res) => {
  const { fname, lname, phoneNumber, bio, avatarUrl, address } = req.body;
  const pool = await getPool();
  const r = await pool
    .request()
    .input('UserID', sql.Int, req.user.id)
    .input('FName', sql.NVarChar(50), fname || null)
    .input('LName', sql.NVarChar(50), lname || null)
    .input('PhoneNumber', sql.VarChar(15), phoneNumber || null)
    .input('Bio', sql.NVarChar(500), bio || null)
    .input('AvatarURL', sql.VarChar(500), avatarUrl || null)
    .input('Address', sql.NVarChar(500), address || null)
    .query(`
      UPDATE dbo.Users
      SET FName = @FName, LName = @LName, PhoneNumber = @PhoneNumber,
          Bio = @Bio, AvatarURL = @AvatarURL, Address = @Address
      WHERE UserID = @UserID;
      SELECT * FROM dbo.Users WHERE UserID = @UserID;
    `);
  const user = r.recordset[0];
  const { Password, ...safe } = user;
  res.json({ ok: true, user: safe });
});

module.exports = { getMe, updateMe };
