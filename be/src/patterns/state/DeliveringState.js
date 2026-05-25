const OrderState = require('./OrderState');

class DeliveringState extends OrderState {
  get name() {
    return 'Delivering';
  }

  /**
   * Buy orders go straight to Completed once delivered;
   * Rent orders enter ActiveRental until the rental period ends.
   */
  onDeliver(ctx) {
    return ctx.orderType === 'Rent' ? 'ActiveRental' : 'Completed';
  }

  onRequestReturn() {
    return 'ReturnRequested';
  }
}

module.exports = DeliveringState;
