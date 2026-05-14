const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

const SECRET = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function sign(payload, opts = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN, ...opts });
}

function verify(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }
}

module.exports = { sign, verify };
