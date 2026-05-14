const OrderState = require('./OrderState');

class PendingPaymentState extends OrderState {
  get name() {
    return 'PendingPayment';
  }

  onPaymentSucceeded() {
    return 'Paid';
  }

  onCancel() {
    return 'Cancelled';
  }
}

module.exports = PendingPaymentState;
