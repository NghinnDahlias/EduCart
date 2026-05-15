/**
 * Observer #3: fire off a notification. In a real deployment this
 * would push to a queue or call an email/SMS provider; here we
 * just log so the wiring is observable in dev.
 */
function createNotificationObserver({ logger = console } = {}) {
  return async function handlePaymentSuccess(payload) {
    logger.log(
      `[notify] PAYMENT_SUCCESS for order #${payload.orderId} via ${payload.gateway || 'unknown gateway'} — amount=${payload.amount}`,
    );
  };
}

module.exports = createNotificationObserver;
