const OrderState = require('./OrderState');

class ReturnedState extends OrderState {
  get name() {
    return 'Returned';
  }
}

module.exports = ReturnedState;
