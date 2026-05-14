const Joi = require('joi');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { services } = require('../container');

/**
 * Multer parses multipart/form-data, so scalar fields arrive as
 * strings — Joi coerces them back to numbers/booleans for us.
 */
const createSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).required(),
  type: Joi.string().valid('Sell', 'Rent').required(),
  subjectCode: Joi.string().required(),
  universityId: Joi.number().integer().required(),
  facultyId: Joi.number().integer().required(),
  subjectId: Joi.number().integer().required(),
  condition: Joi.number().integer().min(0).max(100).optional(),
  stock: Joi.number().integer().min(1).default(1),
});

const create = asyncHandler(async (req, res) => {
  const { value, error } = createSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  if (error) {
    throw new AppError(
      'Validation failed',
      400,
      error.details.map((d) => ({ path: d.path.join('.'), msg: d.message })),
    );
  }

  const imageUrls = (req.files || []).map(
    (f) => `/uploads/products/${f.filename}`,
  );
  if (imageUrls.length > 5) {
    throw new AppError('A product can have at most 5 images', 400);
  }

  const product = await services.productService.createProduct({
    sellerId: req.user.id,
    dto: { ...value, isForRent: value.type === 'Rent' },
    imageUrls,
  });
  res.status(201).json({ ok: true, product, images: imageUrls });
});

const getById = asyncHandler(async (req, res) => {
  const product = await services.productService.getById(Number(req.params.id));
  res.json({ ok: true, product });
});

module.exports = { create, getById };
