const AppError = require("../utils/AppError");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      error: err.message,
      details: err.details,
    });
  }

  // Multer surfaces validation errors with a `.code` we can map.
  // Use err.field to distinguish avatar (2 MB) vs product image (5 MB) limits.
  if (err && err.code === "LIMIT_FILE_SIZE") {
    const isAvatar = err.field === "avatar";
    return res
      .status(400)
      .json({
        ok: false,
        error: `File too large (max ${isAvatar ? "2" : "5"}MB)`,
      });
  }
  if (err && err.code === "LIMIT_FILE_COUNT") {
    return res
      .status(400)
      .json({
        ok: false,
        error: "Too many files (max 5 images per product, 1 for avatar)",
      });
  }
  if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
    return res
      .status(400)
      .json({ ok: false, error: `Unexpected field: ${err.field}` });
  }

  console.error("[unhandled]", err);
  return res.status(500).json({ ok: false, error: "Internal server error" });
}

function notFound(req, res) {
  res
    .status(404)
    .json({
      ok: false,
      error: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}

module.exports = { errorHandler, notFound };
