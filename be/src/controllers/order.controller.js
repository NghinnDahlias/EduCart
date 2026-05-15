const Joi = require('joi');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../utils/validate');
const { services } = require('../container');

const createSchema = Joi.object({
  type: Joi.string().valid('Buy', 'Rent').required(),
  note: Joi.string().allow('').optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).default(1),
      }),
    )
    .min(1)
    .required(),
  // Rent-only fields. The Factory throws if these are missing for Rent.
  rentStartDate: Joi.when('type', {
    is: 'Rent',
    then: Joi.date().required(),
    otherwise: Joi.optional(),
  }),
  rentEndDate: Joi.when('type', {
    is: 'Rent',
    then: Joi.date().required(),
    otherwise: Joi.optional(),
  }),
  dailyRate: Joi.when('type', {
    is: 'Rent',
    then: Joi.number().positive().required(),
    otherwise: Joi.optional(),
  }),
});

const transitionSchema = Joi.object({
  event: Joi.string()
    .valid('onShip', 'onDeliver', 'onComplete', 'onRefundDeposit', 'onCancel')
    .required(),
});

const list = asyncHandler(async (req, res) => {
  const role = req.query.role === 'seller' ? 'seller' : 'buyer';
  const orders = await services.orderService.getOrders(req.user.id, role);
  res.json({ ok: true, orders });
});

const getById = asyncHandler(async (req, res) => {
  const order = await services.orderService.getOrder(Number(req.params.id));
  res.json({ ok: true, order });
});

const create = asyncHandler(async (req, res) => {
  const order = await services.orderService.createOrder({
    buyerId: req.user.id,
    dto: req.body,
  });
  res.status(201).json({ ok: true, order });
});

const transition = asyncHandler(async (req, res) => {
  const next = await services.orderService.transition(
    Number(req.params.id),
    req.body.event,
  );
  res.json({ ok: true, lifecycleState: next });
});

module.exports = {
  list,
  getById,
  create,
  transition,
  createValidator: validate(createSchema),
  transitionValidator: validate(transitionSchema),
};
