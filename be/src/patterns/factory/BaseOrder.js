const AppError = require('../../utils/AppError');

/**
 * Plain value-object that every concrete order type produces.
 * Services and repositories consume this shape — they don't need
 * to know which concrete class built it.
 */
class BaseOrder {
  constructor({ buyerId, sellerId, items, note = null }) {
    if (!buyerId) throw new AppError('buyerId is required', 400);
    if (!sellerId) throw new AppError('sellerId is required', 400);
    if (buyerId === sellerId) {
      throw new AppError('Buyer cannot be the seller', 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    this.buyerId = buyerId;
    this.sellerId = sellerId;
    this.items = items; // [{ productId, quantity, unitPrice }]
    this.note = note;
    this.orderType = 'Buy';
    this.lifecycleState = 'PendingPayment';
  }

  /**
   * Sum of line items (Quantity * UnitPrice). Concrete order types
   * may add fees on top — see RentOrder.getFinalAmount().
   */
  getSubtotal() {
    return this.items.reduce(
      (sum, it) => sum + Number(it.unitPrice) * Number(it.quantity),
      0,
    );
  }

  getFinalAmount() {
    return this.getSubtotal();
  }

  toPersistencePayload() {
    return {
      buyerId: this.buyerId,
      sellerId: this.sellerId,
      orderType: this.orderType,
      lifecycleState: this.lifecycleState,
      note: this.note,
      items: this.items,
      // Rent-specific fields default to null for Buy orders.
      rentStartDate: null,
      rentEndDate: null,
      rentDays: null,
      dailyRate: null,
      deposit: null,
    };
  }
}

module.exports = BaseOrder;
