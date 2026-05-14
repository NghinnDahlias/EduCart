const AppError = require('../../utils/AppError');

/**
 * Strategy interface. Concrete gateways implement createPaymentUrl()
 * and verifyWebhookSignature(). The PaymentService picks one at
 * runtime from PaymentContext based on the user's chosen method.
 */
class PaymentStrategy {
  // eslint-disable-next-line no-unused-vars
  async createPaymentUrl({ orderId, amount, returnUrl, ipAddr }) {
    throw new AppError('createPaymentUrl() must be implemented', 500);
  }

  // eslint-disable-next-line no-unused-vars
  verifyWebhookSignature(payload, signature) {
    throw new AppError('verifyWebhookSignature() must be implemented', 500);
  }

  get name() {
    return this.constructor.name;
  }
}

module.exports = PaymentStrategy;
