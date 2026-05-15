const BuyOrder = require('./BuyOrder');
const RentOrder = require('./RentOrder');
const AppError = require('../../utils/AppError');

/**
 * Factory Method — keeps the order-creation decision in one place.
 * Callers pass `type: 'Buy' | 'Rent'` plus payload and receive a
 * fully-validated concrete order object.
 */
class OrderFactory {
  static create(type, payload) {
    switch ((type || '').toLowerCase()) {
      case 'buy':
        return new BuyOrder(payload);
      case 'rent':
        return new RentOrder(payload);
      default:
        throw new AppError(`Unsupported order type: ${type}`, 400);
    }
  }
}

module.exports = OrderFactory;
