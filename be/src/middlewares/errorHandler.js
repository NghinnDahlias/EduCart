const AppError = require('../utils/AppError');

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
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(400)
      .json({ ok: false, error: 'File too large (max 5MB per image)' });
  }
  if (err && err.code === 'LIMIT_FILE_COUNT') {
    return res
      .status(400)
      .json({ ok: false, error: 'Too many files (max 5 images)' });
  }

  console.error('[unhandled]', err);
  return res.status(500).json({ ok: false, error: 'Internal server error' });
}

function notFound(req, res) {
  res.status(404).json({ ok: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
