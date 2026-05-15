const OrderState = require('./OrderState');

class DepositRefundedState extends OrderState {
  get name() {
    return 'DepositRefunded';
  }
}

module.exports = DepositRefundedState;
