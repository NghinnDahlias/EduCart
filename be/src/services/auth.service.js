const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const jwtUtil = require('../utils/jwt');

const BCRYPT_ROUNDS = 10;

class AuthService {
  /**
   * Dependencies are injected so the service is trivially testable
   * with mocked repositories. See tests/auth.service.test.js.
   */
  constructor({ userRepository, bcryptLib = bcrypt, jwt = jwtUtil } = {}) {
    this.users = userRepository;
    this.bcrypt = bcryptLib;
    this.jwt = jwt;
  }

  async register({ email, password, mssv, universityId, fname, lname }) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new AppError('Email already registered', 409);

    const passwordHash = await this.bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await this.users.create({
      email,
      passwordHash,
      fname,
      lname,
      mssv,
      universityId,
    });
    return this._toPublic(user);
  }

  async login({ email, password }) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new AppError('Invalid credentials', 401);
    if (user.Status !== 'Active') {
      throw new AppError(`Account is ${user.Status}`, 403);
    }

    const ok = await this.bcrypt.compare(password, user.Password);
    if (!ok) throw new AppError('Invalid credentials', 401);

    const token = this.jwt.sign({
      sub: user.UserID,
      email: user.UserEmail,
      role: user.Role,
    });
    return { token, user: this._toPublic(user) };
  }

  _toPublic(user) {
    if (!user) return null;
    const { Password, ...safe } = user;
    return safe;
  }
}

module.exports = AuthService;
