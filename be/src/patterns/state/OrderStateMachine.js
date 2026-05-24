const AppError = require('../../utils/AppError');
const PendingPaymentState = require('./PendingPaymentState');
const PaidState = require('./PaidState');
const DeliveringState = require('./DeliveringState');
const ActiveRentalState = require('./ActiveRentalState');
const CompletedState = require('./CompletedState');
const DepositRefundedState = require('./DepositRefundedState');
const CancelledState = require('./CancelledState');
const ReturnedState = require('./ReturnedState');

const STATE_REGISTRY = {
  PendingPayment: new PendingPaymentState(),
  Paid: new PaidState(),
  Delivering: new DeliveringState(),
  ActiveRental: new ActiveRentalState(),
  Completed: new CompletedState(),
  DepositRefunded: new DepositRefundedState(),
  Cancelled: new CancelledState(),
  Returned: new ReturnedState(),
};

/**
 * The state machine wraps a tiny context object ({ orderId,
 * orderType, currentState }) and delegates events to the current
 * state. Invalid transitions throw AppError(409).
 *
 * Usage:
 *   const sm = new OrderStateMachine({ orderId, orderType, currentState });
 *   const next = sm.dispatch('onPaymentSucceeded');
 *   // persist `next` via repository
 */
class OrderStateMachine {
  constructor({ orderId, orderType, currentState }) {
    if (!STATE_REGISTRY[currentState]) {
      throw new AppError(`Unknown order state: ${currentState}`, 500);
    }
    this.ctx = { orderId, orderType };
    this.current = STATE_REGISTRY[currentState];
  }

  get state() {
    return this.current.name;
  }

  /**
   * Dispatch an event (`onPaymentSucceeded`, `onShip`, ...).
   * Returns the resulting state name and mutates `this.current`.
   */
  dispatch(eventName) {
    const handler = this.current[eventName];
    if (typeof handler !== 'function') {
      throw new AppError(
        `State ${this.current.name} does not handle ${eventName}`,
        409,
      );
    }
    const nextName = handler.call(this.current, this.ctx);
    if (!nextName) return this.current.name;
    if (!STATE_REGISTRY[nextName]) {
      throw new AppError(`Unknown next state: ${nextName}`, 500);
    }
    this.current = STATE_REGISTRY[nextName];
    return this.current.name;
  }
}

OrderStateMachine.STATES = Object.keys(STATE_REGISTRY);

module.exports = OrderStateMachine;
