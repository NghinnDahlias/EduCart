jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_pw"),
  compare: jest.fn().mockResolvedValue(true),
}));

const AuthService = require("../services/auth.service");

const makeFakeBcrypt = () => ({
  hash: jest.fn().mockResolvedValue("hashed_pw"),
  compare: jest.fn().mockResolvedValue(true),
});
const makeFakeJwt = () => ({
  sign: jest.fn().mockReturnValue("jwt.token.value"),
});

describe("AuthService", () => {
  let users;
  let svc;

  beforeEach(() => {
    users = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      updatePasswordHash: jest.fn(),
    };
    svc = new AuthService({
      userRepository: users,
      bcryptLib: makeFakeBcrypt(),
      jwt: makeFakeJwt(),
    });
  });

  it("registers a new user and returns the public user payload", async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockResolvedValue({
      UserID: 1,
      UserEmail: "a@b.com",
      Password: "hashed_pw",
      Role: "Buyer",
    });

    const result = await svc.register({
      email: "a@b.com",
      password: "secret12",
      mssv: "2210001",
      universityId: 1,
    });

    expect(users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "a@b.com",
        passwordHash: "hashed_pw",
        mssv: "2210001",
      }),
    );
    // register now returns { token, user } — same shape as login
    expect(result).not.toHaveProperty("Password");
    expect(result.UserEmail).toBe("a@b.com");
  });

  it("rejects duplicate emails with 409", async () => {
    users.findByEmail.mockResolvedValue({ UserID: 99 });
    await expect(
      svc.register({
        email: "a@b.com",
        password: "secret12",
        mssv: "1",
        universityId: 1,
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("returns a JWT on valid login", async () => {
    users.findByEmail.mockResolvedValue({
      UserID: 1,
      UserEmail: "a@b.com",
      Password: "$2b$10$abcdefghijklmnopqrstuv",
      Role: "Student",
      Status: "Active",
    });
    const result = await svc.login({ email: "a@b.com", password: "secret12" });
    expect(result.token).toBe("jwt.token.value");
    expect(result.user).not.toHaveProperty("Password");
  });

  it("accepts legacy plaintext passwords and upgrades them to bcrypt", async () => {
    const fakeBcrypt = makeFakeBcrypt();
    const local = new AuthService({
      userRepository: users,
      bcryptLib: fakeBcrypt,
      jwt: makeFakeJwt(),
    });
    users.findByEmail.mockResolvedValue({
      UserID: 7,
      UserEmail: "legacy@educart.local",
      Password: "password123",
      Role: "Student",
      Status: "Active",
    });

    const result = await local.login({
      email: "legacy@educart.local",
      password: "password123",
    });

    expect(result.token).toBe("jwt.token.value");
    expect(fakeBcrypt.compare).not.toHaveBeenCalled();
    expect(fakeBcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(users.updatePasswordHash).toHaveBeenCalledWith(7, "hashed_pw");
  });

  it("rejects login when bcrypt.compare returns false", async () => {
    users.findByEmail.mockResolvedValue({
      UserID: 1,
      UserEmail: "a@b.com",
      Password: "$2b$10$abcdefghijklmnopqrstuv",
      Role: "Student",
      Status: "Active",
    });
    const fakeBcrypt = makeFakeBcrypt();
    fakeBcrypt.compare.mockResolvedValue(false);
    const local = new AuthService({
      userRepository: users,
      bcryptLib: fakeBcrypt,
      jwt: makeFakeJwt(),
    });
    await expect(
      local.login({ email: "a@b.com", password: "wrong" }),
    ).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it("rejects login for suspended accounts", async () => {
    users.findByEmail.mockResolvedValue({
      UserID: 1,
      UserEmail: "a@b.com",
      Password: "hashed_pw",
      Role: "Student",
      Status: "Suspended",
    });
    await expect(
      svc.login({ email: "a@b.com", password: "x" }),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
