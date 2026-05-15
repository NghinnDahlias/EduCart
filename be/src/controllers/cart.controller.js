const Joi = require('joi');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../utils/validate');
const { repositories } = require('../container');

const addSchema = Joi.object({
  productId: Joi.number().integer().required(),
});

const getCart = asyncHandler(async (req, res) => {
  const items = await repositories.cartRepository.findByUser(req.user.id);
  res.json({ ok: true, items });
});

const addToCart = asyncHandler(async (req, res) => {
  const item = await repositories.cartRepository.add(req.user.id, req.body.productId);
  res.status(201).json({ ok: true, item });
});

const removeFromCart = asyncHandler(async (req, res) => {
  await repositories.cartRepository.remove(req.user.id, Number(req.params.productId));
  res.json({ ok: true });
});

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  addValidator: validate(addSchema),
};
