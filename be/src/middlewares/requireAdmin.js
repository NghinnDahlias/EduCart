const AppError = require("../utils/AppError");

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "Admin") {
    return next(new AppError("Admin access required", 403));
  }
  return next();
}

module.exports = requireAdmin;
