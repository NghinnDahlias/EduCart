const Joi = require("joi");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validate");
const { repositories } = require("../container");
const { sql, getPool } = require("../config/db");

const getMe = asyncHandler(async (req, res) => {
  const user = await repositories.userRepository.findById(req.user.id);
  if (!user)
    return res.status(404).json({ ok: false, message: "User not found" });
  const { Password, ...safe } = user;
  res.json({ ok: true, user: safe });
});

// API.md uses firstName / lastName; align field names and add Joi validation
const updateMeSchema = Joi.object({
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
  phoneNumber: Joi.string().max(15).optional().allow("", null),
  bio: Joi.string().max(500).optional().allow("", null),
  avatarUrl: Joi.string().uri().max(500).optional().allow("", null),
  address: Joi.string().max(500).optional().allow("", null),
});

const updateMe = asyncHandler(async (req, res) => {
  const { value, error } = updateMeSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      details: error.details.map((d) => ({
        path: d.path.join("."),
        msg: d.message,
      })),
    });
  }

  const { firstName, lastName, phoneNumber, bio, avatarUrl, address } = value;
  const pool = await getPool();
  const r = await pool
    .request()
    .input("UserID", sql.Int, req.user.id)
    .input("FName", sql.NVarChar(50), firstName || null)
    .input("LName", sql.NVarChar(50), lastName || null)
    .input("PhoneNumber", sql.VarChar(15), phoneNumber || null)
    .input("Bio", sql.NVarChar(500), bio || null)
    .input("AvatarURL", sql.VarChar(500), avatarUrl || null)
    .input("Address", sql.NVarChar(500), address || null).query(`
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

/**
 * POST /users/me/avatar
 * multipart/form-data  field: avatar (single file)
 */
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({
        ok: false,
        message: 'No file uploaded. Send a file in the "avatar" field.',
      });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  const pool = await getPool();
  const r = await pool
    .request()
    .input("UserID", sql.Int, req.user.id)
    .input("AvatarURL", sql.VarChar(500), avatarUrl).query(`
      UPDATE dbo.Users SET AvatarURL = @AvatarURL WHERE UserID = @UserID;
      SELECT * FROM dbo.Users WHERE UserID = @UserID;
    `);

  const user = r.recordset[0];
  if (!user)
    return res.status(404).json({ ok: false, message: "User not found" });

  const { Password, ...safe } = user;
  res.json({ ok: true, avatarUrl, user: safe });
});

const getUserPublic = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ ok: false, message: "Invalid user ID" });
  }

  const user = await repositories.userRepository.findById(userId);
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  // Return public profile info only (exclude Password)
  const { Password, ...publicProfile } = user;
  res.json({ ok: true, user: publicProfile });
});

module.exports = {
  getMe,
  updateMe,
  updateMeValidator: validate(updateMeSchema),
  uploadAvatar,
  getUserPublic,
};
