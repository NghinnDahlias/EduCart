const OrderState = require('./OrderState');

class CancelledState extends OrderState {
  get name() {
    return 'Cancelled';
  }
}

module.exports = CancelledState;
