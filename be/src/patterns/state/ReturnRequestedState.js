const OrderState = require('./OrderState');

class ReturnRequestedState extends OrderState {
  get name() {
    return 'ReturnRequested';
  }

  onApproveReturn() {
    return 'Returned';
  }

  onRejectReturn(ctx) {
    return ctx.orderType === 'Rent' ? 'ActiveRental' : 'Completed';
  }
}

module.exports = ReturnRequestedState;
