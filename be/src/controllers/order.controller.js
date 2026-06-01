const Joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validate");
const AppError = require("../utils/AppError");
const { services } = require("../container");

const createSchema = Joi.object({
  type: Joi.string().valid("Buy", "Rent").required(),
  note: Joi.string().allow("").optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).default(1),
      }),
    )
    .min(1)
    .required(),
  rentStartDate: Joi.when("type", {
    is: "Rent",
    then: Joi.date().required(),
    otherwise: Joi.optional(),
  }),
  rentEndDate: Joi.when("type", {
    is: "Rent",
    then: Joi.date().required(),
    otherwise: Joi.optional(),
  }),
  dailyRate: Joi.when("type", {
    is: "Rent",
    then: Joi.number().positive().required(),
    otherwise: Joi.optional(),
  }),
});

const transitionSchema = Joi.object({
  // onPaymentSucceeded is reserved for the payment webhook — not exposed to end-users
  event: Joi.string()
    .valid("onShip", "onDeliver", "onComplete", "onRefundDeposit", "onCancel", "onReturn", "onRequestReturn", "onApproveReturn", "onRejectReturn")
    .required(),
});

const list = asyncHandler(async (req, res) => {
  const role = req.query.role === "seller" ? "seller" : "buyer";
  const orders = await services.orderService.getOrders(req.user.id, role);
  res.json({ ok: true, orders });
});

const getById = asyncHandler(async (req, res) => {
  const order = await services.orderService.getOrder(Number(req.params.id));
  // Only the buyer or seller of this order may view it
  if (order.BuyerID !== req.user.id && order.SellerID !== req.user.id) {
    throw new AppError("You do not have permission to view this order", 403);
  }
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
  const orderId = Number(req.params.id);
  const order = await services.orderService.getOrder(orderId);
  if (order.BuyerID !== req.user.id && order.SellerID !== req.user.id) {
    throw new AppError("You do not have permission to update this order", 403);
  }

  const result = await services.orderService.transition(orderId, req.body.event);
  res.json({ ok: true, ...result });
});

module.exports = {
  list,
  getById,
  create,
  transition,
  createValidator: validate(createSchema),
  transitionValidator: validate(transitionSchema),
};
