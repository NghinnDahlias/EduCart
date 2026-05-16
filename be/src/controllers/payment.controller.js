const Joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validate");
const { services } = require("../container");

const initiateSchema = Joi.object({
  orderId: Joi.number().integer().required(),
  method: Joi.string().valid("MoMo", "VNPay").required(),
  returnUrl: Joi.string().uri().optional(),
});

const webhookSchema = Joi.object({
  method: Joi.string().valid("MoMo", "VNPay").required(),
  signature: Joi.string().required(),
  payload: Joi.object().required(),
});

const list = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await services.paymentService.getPaymentHistory(
    req.user.id,
    page,
    limit,
  );
  res.json({ ok: true, ...result });
});

const initiate = asyncHandler(async (req, res) => {
  const result = await services.paymentService.initiate({
    userId: req.user.id,
    orderId: req.body.orderId,
    method: req.body.method,
    returnUrl: req.body.returnUrl,
    ipAddr: req.ip,
  });
  res.json({ ok: true, ...result });
});

/**
 * Public endpoint — the gateway calls it. We rely on the
 * strategy's signature verification rather than auth middleware.
 */
const webhook = asyncHandler(async (req, res) => {
  const result = await services.paymentService.handleWebhook(req.body);
  res.json({ ok: true, ...result });
});

module.exports = {
  list,
  initiate,
  webhook,
  initiateValidator: validate(initiateSchema),
  webhookValidator: validate(webhookSchema),
};
