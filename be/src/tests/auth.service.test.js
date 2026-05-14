jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_pw'),
  compare: jest.fn().mockResolvedValue(true),
}));

const AuthService = require('../services/auth.service');

const makeFakeBcrypt = () => ({
  hash: jest.fn().mockResolvedValue('hashed_pw'),
  compare: jest.fn().mockResolvedValue(true),
});
const makeFakeJwt = () => ({ sign: jest.fn().mockReturnValue('jwt.token.value') });

describe('AuthService', () => {
  let users;
  let svc;

  beforeEach(() => {
    users = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    svc = new AuthService({
      userRepository: users,
      bcryptLib: makeFakeBcrypt(),
      jwt: makeFakeJwt(),
    });
  });

  it('registers a new user when email is free', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockResolvedValue({ UserID: 1, UserEmail: 'a@b.com', Password: 'hashed_pw' });

    const result = await svc.register({
      email: 'a@b.com',
      password: 'secret12',
      mssv: '2210001',
      universityId: 1,
    });

    expect(users.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'a@b.com', passwordHash: 'hashed_pw', mssv: '2210001' }),
    );
    expect(result).not.toHaveProperty('Password');
    expect(result.UserEmail).toBe('a@b.com');
  });

  it('rejects duplicate emails with 409', async () => {
    users.findByEmail.mockResolvedValue({ UserID: 99 });
    await expect(
      svc.register({ email: 'a@b.com', password: 'secret12', mssv: '1', universityId: 1 }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('returns a JWT on valid login', async () => {
    users.findByEmail.mockResolvedValue({
      UserID: 1,
      UserEmail: 'a@b.com',
      Password: 'hashed_pw',
      Role: 'Student',
      Status: 'Active',
    });
    const result = await svc.login({ email: 'a@b.com', password: 'secret12' });
    expect(result.token).toBe('jwt.token.value');
    expect(result.user).not.toHaveProperty('Password');
  });

  it('rejects login when bcrypt.compare returns false', async () => {
    users.findByEmail.mockResolvedValue({
      UserID: 1, UserEmail: 'a@b.com', Password: 'hashed_pw', Role: 'Student', Status: 'Active',
    });
    const fakeBcrypt = makeFakeBcrypt();
    fakeBcrypt.compare.mockResolvedValue(false);
    const local = new AuthService({
      userRepository: users, bcryptLib: fakeBcrypt, jwt: makeFakeJwt(),
    });
    await expect(local.login({ email: 'a@b.com', password: 'wrong' })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('rejects login for suspended accounts', async () => {
    users.findByEmail.mockResolvedValue({
      UserID: 1, UserEmail: 'a@b.com', Password: 'hashed_pw', Role: 'Student', Status: 'Suspended',
    });
    await expect(svc.login({ email: 'a@b.com', password: 'x' })).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
