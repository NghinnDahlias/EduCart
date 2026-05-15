const AppError = require('../utils/AppError');
const paymentContext = require('../patterns/strategy/PaymentContext');
const { eventBus } = require('../patterns/observer');

class PaymentService {
  constructor({ paymentRepository, orderRepository, strategies = paymentContext, bus = eventBus }) {
    this.payments = paymentRepository;
    this.orders = orderRepository;
    this.strategies = strategies;
    this.bus = bus;
  }

  /**
   * Build a payment URL via the chosen Strategy and record a
   * Pending PaymentTransaction we can match up against the
   * incoming webhook.
   */
  async initiate({ userId, orderId, method, returnUrl, ipAddr }) {
    const order = await this.orders.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    if (order.BuyerID !== userId) {
      throw new AppError('You can only pay for your own order', 403);
    }
    if (order.LifecycleState !== 'PendingPayment') {
      throw new AppError(
        `Order is in state ${order.LifecycleState} and cannot be paid`,
        409,
      );
    }

    // FinalAmount lives in code (subtotal + deposit for rentals). Recompute.
    const items = await this.orders.findItemsByOrderId(orderId);
    const subtotal = items.reduce(
      (s, it) => s + Number(it.Quantity) * Number(it.UnitPrice),
      0,
    );
    const amount =
      order.OrderType === 'Rent'
        ? Number(order.Deposit || 0) +
          Number(order.DailyRate || 0) * Number(order.RentDays || 0)
        : subtotal;

    const strategy = this.strategies.get(method);
    const tx = await this.payments.createTransaction({
      userId,
      amount,
      payMethod: method,
      orderId,
    });
    const result = await strategy.createPaymentUrl({
      orderId,
      amount,
      returnUrl,
      ipAddr,
    });
    return { ...result, payTxId: tx.PayTxID, amount };
  }

  /**
   * Webhook entry point. Verifies the gateway signature, marks the
   * PaymentTransaction Completed/Failed, then publishes PAYMENT_SUCCESS
   * onto the bus so the registered observers run.
   */
  async handleWebhook({ method, payload, signature }) {
    const strategy = this.strategies.get(method);
    const ok = strategy.verifyWebhookSignature(payload, signature);
    if (!ok) throw new AppError('Invalid webhook signature', 401);

    const orderId =
      Number(payload.orderId) || Number(payload.vnp_TxnRef);
    if (!orderId) throw new AppError('Webhook missing orderId', 400);

    const tx = await this.payments.findByOrderId(orderId);
    const succeeded =
      String(payload.resultCode) === '0' ||
      String(payload.vnp_ResponseCode) === '00';

    if (!succeeded) {
      if (tx) await this.payments.markFailed(tx.PayTxID);
      await this.bus.emit('PAYMENT_FAILED', { orderId, gateway: method });
      return { ok: false, orderId };
    }

    if (tx) await this.payments.markCompleted(tx.PayTxID);
    await this.bus.emit('PAYMENT_SUCCESS', {
      orderId,
      gateway: method,
      amount: payload.amount || payload.vnp_Amount,
    });
    return { ok: true, orderId };
  }
}

module.exports = PaymentService;
