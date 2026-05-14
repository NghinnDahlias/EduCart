const AppError = require('../../utils/AppError');

/**
 * Base state. Each concrete state declares the events it accepts;
 * everything else throws a 409 (invalid transition).
 *
 * Events flow in from the OrderStateMachine; states return the
 * name of the next state (or null to stay).
 */
class OrderState {
  get name() {
    throw new AppError('State must define a name', 500);
  }

  // eslint-disable-next-line no-unused-vars
  onPaymentSucceeded(ctx) {
    throw new AppError(
      `Cannot mark paid from state ${this.name}`,
      409,
    );
  }

  // eslint-disable-next-line no-unused-vars
  onShip(ctx) {
    throw new AppError(`Cannot ship from state ${this.name}`, 409);
  }

  // eslint-disable-next-line no-unused-vars
  onDeliver(ctx) {
    throw new AppError(`Cannot deliver from state ${this.name}`, 409);
  }

  // eslint-disable-next-line no-unused-vars
  onComplete(ctx) {
    throw new AppError(
      `Cannot complete from state ${this.name}`,
      409,
    );
  }

  // eslint-disable-next-line no-unused-vars
  onRefundDeposit(ctx) {
    throw new AppError(
      `Cannot refund deposit from state ${this.name}`,
      409,
    );
  }

  // eslint-disable-next-line no-unused-vars
  onCancel(ctx) {
    throw new AppError(`Cannot cancel from state ${this.name}`, 409);
  }
}

module.exports = OrderState;
