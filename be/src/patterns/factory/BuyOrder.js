const BaseOrder = require('./BaseOrder');

class BuyOrder extends BaseOrder {
  constructor(payload) {
    super(payload);
    this.orderType = 'Buy';
  }
}

module.exports = BuyOrder;
