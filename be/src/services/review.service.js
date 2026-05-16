const AppError = require("../utils/AppError");

class ReviewService {
  constructor({ reviewRepository, orderRepository }) {
    this.reviews = reviewRepository;
    this.orders = orderRepository;
  }

  async listByProduct(productId) {
    return this.reviews.findByProduct(productId);
  }

  /**
   * Create a review with full business-rule validation:
   *  1. Order must exist and belong to the reviewer as buyer.
   *  2. Order must be Completed (can't review a pending/cancelled order).
   *  3. The product must be in that order's items.
   *  4. No duplicate review for the same order+product.
   */
  async create({ reviewerId, productId, orderId, rating, comment }) {
    // Rule 1 — order ownership
    const order = await this.orders.findByIdWithItems(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (order.BuyerID !== reviewerId) {
      throw new AppError("You can only review orders you placed", 403);
    }

    // Rule 2 — order must be completed
    if (order.LifecycleState !== "Completed") {
      throw new AppError(
        `Order is ${order.LifecycleState}. You can only review completed orders.`,
        409,
      );
    }

    // Rule 3 — product must belong to this order
    const inOrder = order.items.some((i) => i.ProductID === productId);
    if (!inOrder) {
      throw new AppError("Product was not part of this order", 400);
    }

    // Rule 4 — no duplicate
    const existing = await this.reviews.findByOrderAndProduct(
      orderId,
      productId,
    );
    if (existing) {
      throw new AppError(
        "You have already reviewed this product for this order",
        409,
      );
    }

    return this.reviews.create({
      reviewerId,
      productId,
      orderId,
      rating,
      comment,
    });
  }
}

module.exports = ReviewService;
