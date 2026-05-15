const Joi = require('joi');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../utils/validate');
const { services } = require('../container');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  mssv: Joi.string().required(),
  universityId: Joi.number().integer().required(),
  fname: Joi.string().max(50).optional(),
  lname: Joi.string().max(50).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = asyncHandler(async (req, res) => {
  const user = await services.authService.register(req.body);
  res.status(201).json({ ok: true, user });
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
