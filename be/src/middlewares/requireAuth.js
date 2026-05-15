const { verify } = require('../utils/jwt');
const AppError = require('../utils/AppError');

/**
 * Reads `Authorization: Bearer <jwt>`, verifies it, and attaches
 * the decoded payload to `req.user`. Throws 401 on missing/invalid
 * tokens.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Missing Bearer token', 401));
  }
  const payload = verify(token);
  req.user = { id: payload.sub, email: payload.email, role: payload.role };
  return next();
}

module.exports = requireAuth;
