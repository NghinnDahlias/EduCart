const MomoPayment = require('./MomoPayment');
const VNPayPayment = require('./VNPayPayment');
const AppError = require('../../utils/AppError');

/**
 * Registry/context for the Strategy pattern. Looks up the right
 * concrete strategy by code so callers don't have to know about
 * the constructors.
 */
class PaymentContext {
  constructor() {
    this.strategies = new Map();
    this.register('MoMo', new MomoPayment());
    this.register('VNPay', new VNPayPayment());
  }

  register(code, strategy) {
    this.strategies.set(code.toLowerCase(), strategy);
  }

  get(code) {
    const s = this.strategies.get(String(code || '').toLowerCase());
    if (!s) throw new AppError(`Unknown payment method: ${code}`, 400);
    return s;
  }
}

module.exports = new PaymentContext();
