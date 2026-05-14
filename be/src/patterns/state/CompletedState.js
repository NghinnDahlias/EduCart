const OrderState = require('./OrderState');
const AppError = require('../../utils/AppError');

class CompletedState extends OrderState {
  get name() {
    return 'Completed';
  }

  onRefundDeposit(ctx) {
    if (ctx.orderType !== 'Rent') {
      throw new AppError(
        'Only rent orders have a deposit to refund',
        409,
      );
    }
    return 'DepositRefunded';
  }
}

module.exports = CompletedState;
