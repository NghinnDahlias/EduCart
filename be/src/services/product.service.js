const AppError = require("../utils/AppError");

class ProductService {
  constructor({ productRepository }) {
    this.products = productRepository;
  }

  async list(filters) {
    const normalizedFilters = { ...filters };
    if (normalizedFilters.sellerId === undefined && !normalizedFilters.status) {
      normalizedFilters.status = 'Available';
    }
    return this.products.list(normalizedFilters);
  }

  async createProduct({ sellerId, dto, imageUrls }) {
    if (imageUrls && imageUrls.length > 5) {
      throw new AppError("A product can have at most 5 images", 400);
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
    if (!p) throw new AppError("Product not found", 404);
    await this.products.incrementViewCount(id);
    return p;
  }

  async updateProduct({ productId, sellerId, dto }) {
    // Verify ownership
    const product = await this.products.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    if (product.SellerID !== sellerId) {
      throw new AppError(
        "Unauthorized: You can only edit your own products",
        403,
      );
    }

    // Cannot update sold/rented products
    if (product.Status === "Sold" || product.Status === "Renting") {
      throw new AppError(
        "Cannot update a product that is sold or renting",
        400,
      );
    }

    const updated = await this.products.update({
      productId,
      title: dto.title ?? product.Title,
      description: dto.description ?? product.Description,
      price: dto.price ?? product.Price,
      stock: dto.stock ?? product.Stock,
      condition: dto.condition ?? product.Condition,
      author: dto.author ?? product.Author,
      category: dto.category ?? product.Category,
      format: dto.format ?? product.Format,
      termLabel: dto.termLabel ?? product.TermLabel,
      originalPrice: dto.originalPrice ?? product.OriginalPrice,
      discountLabel: dto.discountLabel ?? product.DiscountLabel,
      rentalPrice: dto.rentalPrice ?? product.RentalPrice,
      language: dto.language ?? product.Language,
      pages: dto.pages ?? product.Pages,
      publisher: dto.publisher ?? product.Publisher,
      publishYear: dto.publishYear ?? product.PublishYear,
      isbn: dto.isbn ?? product.ISBN,
    });
    return updated;
  }

  async deleteProduct({ productId, sellerId }) {
    // Verify ownership
    const product = await this.products.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    if (product.SellerID !== sellerId) {
      throw new AppError(
        "Unauthorized: You can only delete your own products",
        403,
      );
    }

    // Cannot delete sold/rented products
    if (product.Status === "Sold" || product.Status === "Renting") {
      throw new AppError(
        "Cannot delete a product that is sold or renting",
        400,
      );
    }

    await this.products.delete(productId);
  }
}
module.exports = ProductService;
