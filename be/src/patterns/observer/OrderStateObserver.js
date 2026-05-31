/**
 * Observer #1: advances the order's lifecycle state when payment
 * succeeds. Uses the OrderStateMachine to enforce the only-legal
 * transitions invariant.
 */
const OrderStateMachine = require('../state/OrderStateMachine');

function createOrderStateObserver({ orderRepository }) {
  return async function handlePaymentSuccess(payload) {
    const { orderId } = payload;
    const order = await orderRepository.findById(orderId);
    if (!order) return;

    const normalizePaidType = (gateway) => {
      if (!gateway) return null;
      if (gateway === 'MoMo' || gateway === 'VNPay') return 'EWallet';
      if (gateway === 'Cash' || gateway === 'BankTransfer' || gateway === 'Coin') {
        return gateway;
      }
      return null;
    };

    const sm = new OrderStateMachine({
      orderId: order.OrderID,
      orderType: order.OrderType,
      currentState: order.LifecycleState,
    });
    const next = sm.dispatch('onPaymentSucceeded');
    await orderRepository.updateLifecycleState(orderId, next, {
      isPaid: true,
      paidType: normalizePaidType(payload.gateway),
    });
  };
}

module.exports = createOrderStateObserver;
