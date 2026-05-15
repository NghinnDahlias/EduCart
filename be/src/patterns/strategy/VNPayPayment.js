const crypto = require('crypto');
const PaymentStrategy = require('./PaymentStrategy');

class VNPayPayment extends PaymentStrategy {
  constructor({
    tmnCode = process.env.VNPAY_TMN_CODE,
    secret = process.env.VNPAY_SECRET,
    endpoint = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  } = {}) {
    super();
    this.tmnCode = tmnCode;
    this.secret = secret;
    this.endpoint = endpoint;
  }

  async createPaymentUrl({ orderId, amount, returnUrl, ipAddr = '127.0.0.1' }) {
    const params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Amount: Math.round(amount * 100), // VNPay expects amount * 100
      vnp_CurrCode: 'VND',
      vnp_TxnRef: String(orderId),
      vnp_OrderInfo: `Payment for order ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: returnUrl || '',
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 14),
    };

    const signData = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&');
    const signature = crypto
      .createHmac('sha512', this.secret || 'dev')
      .update(signData)
      .digest('hex');

    const query = `${signData}&vnp_SecureHash=${signature}`;
    return {
      gateway: 'VNPay',
      paymentUrl: `${this.endpoint}?${query}`,
      signature,
    };
  }

  verifyWebhookSignature(payload, signature) {
    const data = { ...payload };
    delete data.vnp_SecureHash;
    delete data.vnp_SecureHashType;
    const signData = Object.keys(data)
      .sort()
      .map((k) => `${k}=${data[k]}`)
      .join('&');
    const expected = crypto
      .createHmac('sha512', this.secret || 'dev')
      .update(signData)
      .digest('hex');
    return expected === signature;
  }
}

module.exports = VNPayPayment;
