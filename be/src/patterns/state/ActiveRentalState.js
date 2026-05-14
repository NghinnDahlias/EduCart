const OrderState = require('./OrderState');

class ActiveRentalState extends OrderState {
  get name() {
    return 'ActiveRental';
  }

  onComplete() {
    return 'Completed';
  }
}

module.exports = ActiveRentalState;
