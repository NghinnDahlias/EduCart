const crypto = require('crypto');
const PaymentStrategy = require('./PaymentStrategy');

class MomoPayment extends PaymentStrategy {
  constructor({
    partnerCode = process.env.MOMO_PARTNER_CODE,
    secret = process.env.MOMO_SECRET,
    endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create',
  } = {}) {
    super();
    this.partnerCode = partnerCode;
    this.secret = secret;
    this.endpoint = endpoint;
  }

  /**
   * Builds the redirect URL the FE should send the user to.
   * For this assignment we mock the actual gateway call and just
   * return a deterministic sandbox URL that the FE can hit.
   */
  async createPaymentUrl({ orderId, amount, returnUrl }) {
    const requestId = `${orderId}-${Date.now()}`;
    const rawSig = `partnerCode=${this.partnerCode}&amount=${amount}&orderId=${orderId}&requestId=${requestId}`;
    const signature = crypto
      .createHmac('sha256', this.secret || 'dev')
      .update(rawSig)
      .digest('hex');

    return {
      gateway: 'MoMo',
      paymentUrl: `${this.endpoint}?orderId=${orderId}&requestId=${requestId}&signature=${signature}&returnUrl=${encodeURIComponent(returnUrl || '')}`,
      requestId,
      signature,
    };
  }

  verifyWebhookSignature(payload, signature) {
    const raw = `orderId=${payload.orderId}&amount=${payload.amount}&resultCode=${payload.resultCode}`;
    const expected = crypto
      .createHmac('sha256', this.secret || 'dev')
      .update(raw)
      .digest('hex');
    return expected === signature;
  }

  buildMockWebhook({ orderId, amount, success }) {
    const payload = {
      orderId: String(orderId),
      amount: String(amount),
      resultCode: success ? '0' : '1006',
    };
    const raw = `orderId=${payload.orderId}&amount=${payload.amount}&resultCode=${payload.resultCode}`;
    const signature = crypto
      .createHmac('sha256', this.secret || 'dev')
      .update(raw)
      .digest('hex');
    return { payload, signature };
  }
}

module.exports = MomoPayment;
