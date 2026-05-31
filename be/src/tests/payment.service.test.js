const PaymentService = require('../services/payment.service');

function makeStrategies(verifyResult = true) {
  return {
    get: jest.fn().mockReturnValue({
      createPaymentUrl: jest
        .fn()
        .mockResolvedValue({ paymentUrl: 'http://gateway/pay', gateway: 'MoMo' }),
      verifyWebhookSignature: jest.fn().mockReturnValue(verifyResult),
    }),
  };
}

function makeBus() {
  return { emit: jest.fn().mockResolvedValue(undefined) };
}

describe('PaymentService', () => {
  let payments;
  let orders;

  beforeEach(() => {
    payments = {
      createTransaction: jest.fn().mockResolvedValue({ PayTxID: 1 }),
      markCompleted: jest.fn(),
      markFailed: jest.fn(),
      findByOrderId: jest.fn().mockResolvedValue({ PayTxID: 1 }),
    };
    orders = {
      findById: jest.fn(),
      findItemsByOrderId: jest.fn().mockResolvedValue([
        { Quantity: 1, UnitPrice: 100 },
      ]),
    };
  });

  it('initiates a payment URL via the chosen strategy', async () => {
    orders.findById.mockResolvedValue({
      BuyerID: 1, OrderType: 'Buy', LifecycleState: 'PendingPayment',
    });
    const strategies = makeStrategies();
    const svc = new PaymentService({
      paymentRepository: payments, orderRepository: orders, strategies, bus: makeBus(),
    });

    const result = await svc.initiate({
      userId: 1, orderId: 1, method: 'MoMo', returnUrl: 'http://x',
    });
    expect(result.paymentUrl).toBe('http://gateway/pay');
    expect(payments.createTransaction).toHaveBeenCalled();
    expect(strategies.get).toHaveBeenCalledWith('MoMo');
  });

  it('rejects payment for someone else’s order', async () => {
    orders.findById.mockResolvedValue({
      BuyerID: 99, OrderType: 'Buy', LifecycleState: 'PendingPayment',
    });
    const svc = new PaymentService({
      paymentRepository: payments, orderRepository: orders,
      strategies: makeStrategies(), bus: makeBus(),
    });
    await expect(
      svc.initiate({ userId: 1, orderId: 1, method: 'MoMo' }),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('rejects webhook with bad signature', async () => {
    const svc = new PaymentService({
      paymentRepository: payments, orderRepository: orders,
      strategies: makeStrategies(false), bus: makeBus(),
    });
    await expect(
      svc.handleWebhook({
        method: 'MoMo',
        signature: 'bad',
        payload: { orderId: 1, resultCode: '0' },
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('emits PAYMENT_SUCCESS and marks tx completed on a valid success webhook', async () => {
    const bus = makeBus();
    const svc = new PaymentService({
      paymentRepository: payments, orderRepository: orders,
      strategies: makeStrategies(true), bus,
    });

    const out = await svc.handleWebhook({
      method: 'MoMo',
      signature: 'sig',
      payload: { orderId: 1, resultCode: '0', amount: 200 },
    });

    expect(out.ok).toBe(true);
    expect(payments.markCompleted).toHaveBeenCalledWith(1);
    expect(bus.emit).toHaveBeenCalledWith(
      'PAYMENT_SUCCESS',
      expect.objectContaining({ orderId: 1, gateway: 'MoMo' }),
    );
  });

  it('marks the payment failed without releasing the order on non-zero result codes', async () => {
    const bus = makeBus();
    const svc = new PaymentService({
      paymentRepository: payments, orderRepository: orders,
      strategies: makeStrategies(true), bus,
    });
    const out = await svc.handleWebhook({
      method: 'MoMo',
      signature: 'sig',
      payload: { orderId: 1, resultCode: '99' },
    });
    expect(out.ok).toBe(false);
    expect(payments.markFailed).toHaveBeenCalledWith(1);
    expect(bus.emit).not.toHaveBeenCalled();
  });
});
