const Joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validate");
const { services } = require("../container");

const createSchema = Joi.object({
  orderId: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(2000).allow("", null).optional(),
});

/**
 * GET /products/:productId/reviews
 * Public — list all reviews for a product.
 */
const list = asyncHandler(async (req, res) => {
  const reviews = await services.reviewService.listByProduct(
    Number(req.params.productId),
  );
  res.json({ ok: true, reviews });
});

/**
 * POST /products/:productId/reviews  [Auth required]
 * Authenticated buyer creates a review for a product they purchased.
 */
const create = asyncHandler(async (req, res) => {
  const review = await services.reviewService.create({
    reviewerId: req.user.id,
    productId: Number(req.params.productId),
    orderId: req.body.orderId,
    rating: req.body.rating,
    comment: req.body.comment,
  });
  res.status(201).json({ ok: true, review });
});

module.exports = {
  list,
  create,
  createValidator: validate(createSchema),
};
