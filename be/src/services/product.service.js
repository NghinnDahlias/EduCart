const AppError = require('../utils/AppError');

class ProductService {
  constructor({ productRepository }) {
    this.products = productRepository;
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
