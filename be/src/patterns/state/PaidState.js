const OrderState = require('./OrderState');

class PaidState extends OrderState {
  get name() {
    return 'Paid';
  }

  onShip() {
    return 'Delivering';
  }
}

module.exports = PaidState;
