/**
 * Wraps async controllers so thrown/rejected errors flow through
 * Express's error pipeline rather than crashing the process.
 */
module.exports = function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};
