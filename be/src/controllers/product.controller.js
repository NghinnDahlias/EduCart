const Joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { services } = require("../container");

const createSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().min(0).required(),
  type: Joi.string().valid("Sell", "Rent").required(),
  subjectCode: Joi.string().allow("").optional(),
  universityId: Joi.number().integer().required(),
  facultyId: Joi.number().integer().required(),
  subjectId: Joi.number().integer().required(),
  condition: Joi.number().integer().min(0).max(100).optional(),
  stock: Joi.number().integer().min(1).default(1),
  author: Joi.string().max(255).optional(),
  category: Joi.string().max(100).optional(),
  format: Joi.string().max(50).optional(),
  termLabel: Joi.string().max(50).optional(),
  originalPrice: Joi.number().min(0).optional(),
  discountLabel: Joi.string().max(50).optional(),
  rentalPrice: Joi.number().min(0).optional(),
  language: Joi.string().max(50).optional(),
  pages: Joi.number().integer().min(1).optional(),
  publisher: Joi.string().max(255).optional(),
  publishYear: Joi.number().integer().min(1000).max(9999).optional(),
  isbn: Joi.string().max(20).optional(),
});

const list = asyncHandler(async (req, res) => {
  const {
    search,
    status,
    page,
    limit,
    universityId,
    facultyId,
    subjectId,
    forRent,
  } = req.query;
  const result = await services.productService.list({
    search,
    status,
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    universityId: universityId ? Number(universityId) : undefined,
    facultyId: facultyId ? Number(facultyId) : undefined,
    subjectId: subjectId ? Number(subjectId) : undefined,
    forRent: forRent !== undefined ? forRent === "true" : undefined,
  });
  res.json({ ok: true, ...result });
});

const create = asyncHandler(async (req, res) => {
  const { value, error } = createSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  if (error) {
    throw new AppError(
      "Validation failed",
      400,
      error.details.map((d) => ({ path: d.path.join("."), msg: d.message })),
    );
  }

  const imageUrls = (req.files || []).map(
    (f) => `/uploads/products/${f.filename}`,
  );
  if (imageUrls.length > 5) {
    throw new AppError("A product can have at most 5 images", 400);
  }

  const product = await services.productService.createProduct({
    sellerId: req.user.id,
    dto: { ...value, isForRent: value.type === "Rent" },
    imageUrls,
  });
  res.status(201).json({ ok: true, product, images: imageUrls });
});

const getById = asyncHandler(async (req, res) => {
  const product = await services.productService.getById(Number(req.params.id));
  res.json({ ok: true, product });
});

const updateSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().integer().min(1).optional(),
  condition: Joi.number().integer().min(0).max(100).optional(),
  author: Joi.string().max(255).optional(),
  category: Joi.string().max(100).optional(),
  format: Joi.string().max(50).optional(),
  termLabel: Joi.string().max(50).optional(),
  originalPrice: Joi.number().min(0).optional(),
  discountLabel: Joi.string().max(50).optional(),
  rentalPrice: Joi.number().min(0).optional(),
  language: Joi.string().max(50).optional(),
  pages: Joi.number().integer().min(1).optional(),
  publisher: Joi.string().max(255).optional(),
  publishYear: Joi.number().integer().min(1000).max(9999).optional(),
  isbn: Joi.string().max(20).optional(),
});

const update = asyncHandler(async (req, res) => {
  const { value, error } = updateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  if (error) {
    throw new AppError(
      "Validation failed",
      400,
      error.details.map((d) => ({ path: d.path.join("."), msg: d.message })),
    );
  }

  // If new files were uploaded, replace the product's images
  const imageUrls =
    req.files && req.files.length > 0
      ? req.files.map((f) => `/uploads/products/${f.filename}`)
      : null; // null = keep existing images

  if (imageUrls && imageUrls.length > 5) {
    throw new AppError("A product can have at most 5 images", 400);
  }

  const productId = Number(req.params.id);
  const product = await services.productService.updateProduct({
    productId,
    sellerId: req.user.id,
    dto: value,
    imageUrls,
  });
  res.json({ ok: true, product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  await services.productService.deleteProduct({
    productId,
    sellerId: req.user.id,
  });
  res.json({ ok: true, message: "Product deleted successfully" });
});

module.exports = { list, create, getById, update, deleteProduct };
