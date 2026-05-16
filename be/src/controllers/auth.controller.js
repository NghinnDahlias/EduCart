const Joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validate");
const { services } = require("../container");

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).required(),
  mssv: Joi.string().required(),
  universityId: Joi.number().integer().required(),
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
  role: Joi.string().valid("Student", "Admin").optional(),
  eduLevel: Joi.string()
    .valid("Undergraduate", "Graduate", "Postgraduate")
    .optional(),
  year: Joi.number().integer().min(1).max(8).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
});

const register = asyncHandler(async (req, res) => {
  // register() returns the public user object; we then log them in to get a token
  const result = await services.authService.register(req.body);
  res.status(201).json({ ok: true, ...result });
});

const login = asyncHandler(async (req, res) => {
  const result = await services.authService.login(req.body);
  res.json({ ok: true, ...result });
});

module.exports = {
  register,
  login,
  registerValidator: validate(registerSchema),
  loginValidator: validate(loginSchema),
};
