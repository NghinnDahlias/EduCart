const path = require("path");
const fs = require("fs");
const multer = require("multer");
const AppError = require("../utils/AppError");

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400));
  }
  return cb(null, true);
}

function makeStorage(subdir) {
  const dir = path.join(__dirname, "..", "..", "uploads", subdir);
  fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, dir);
    },
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });
}

// Product images: up to 5, 5 MB each
const upload = multer({
  storage: makeStorage("products"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

// Avatar: single image, 2 MB
const uploadAvatar = multer({
  storage: makeStorage("avatars"),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});

module.exports = upload;
module.exports.uploadAvatar = uploadAvatar;
