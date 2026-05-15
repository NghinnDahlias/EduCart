const AppError = require('../utils/AppError');

class ProductService {
  constructor({ productRepository }) {
    this.products = productRepository;
  }

  async list(filters) {
    return this.products.list(filters);
  }

  async createProduct({ sellerId, dto, imageUrls }) {
    if (imageUrls && imageUrls.length > 5) {
      throw new AppError('A product can have at most 5 images', 400);
    }

    const product = await this.products.create({
      sellerId,
      universityId: dto.universityId,
      facultyId: dto.facultyId,
      subjectId: dto.subjectId,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      isForRent: !!dto.isForRent,
      condition: dto.condition ?? null,
      stock: dto.stock ?? 1,
      images: imageUrls || [],
      author: dto.author ?? null,
      category: dto.category ?? null,
      format: dto.format ?? null,
      termLabel: dto.termLabel ?? null,
      originalPrice: dto.originalPrice ?? null,
      discountLabel: dto.discountLabel ?? null,
      rentalPrice: dto.rentalPrice ?? null,
      language: dto.language ?? null,
      pages: dto.pages ?? null,
      publisher: dto.publisher ?? null,
      publishYear: dto.publishYear ?? null,
      isbn: dto.isbn ?? null,
    });
    return product;
  }

  async getById(id) {
    const p = await this.products.findById(id);
    if (!p) throw new AppError('Product not found', 404);
    return p;
  }
}

module.exports = ProductService;
