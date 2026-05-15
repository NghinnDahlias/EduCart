const OrderService = require('../services/order.service');

describe('OrderService', () => {
  let orders;
  let products;
  let svc;

  beforeEach(() => {
    orders = {
      createWithItems: jest.fn(),
      findById: jest.fn(),
      updateLifecycleState: jest.fn(),
    };
    products = { findManyByIds: jest.fn() };
    svc = new OrderService({ orderRepository: orders, productRepository: products });
  });

  it('creates a Buy order with the right subtotal and persists items', async () => {
    products.findManyByIds.mockResolvedValue([
      { ProductID: 10, SellerID: 2, Price: '50.00', IsForRent: false, Status: 'Available' },
      { ProductID: 11, SellerID: 2, Price: '20.00', IsForRent: false, Status: 'Available' },
    ]);
    orders.createWithItems.mockResolvedValue({ OrderID: 42, LifecycleState: 'PendingPayment' });

    const result = await svc.createOrder({
      buyerId: 1,
      dto: {
        type: 'Buy',
        items: [
          { productId: 10, quantity: 1 },
          { productId: 11, quantity: 2 },
        ],
      },
    });

    expect(orders.createWithItems).toHaveBeenCalledWith(
      expect.objectContaining({
        orderType: 'Buy',
        lifecycleState: 'PendingPayment',
        buyerId: 1,
        sellerId: 2,
        items: [
          { productId: 10, quantity: 1, unitPrice: 50 },
          { productId: 11, quantity: 2, unitPrice: 20 },
        ],
      }),
    );
    expect(result.Subtotal).toBe(90);
    expect(result.FinalAmount).toBe(90);
  });

  it('creates a Rent order computing deposit and total', async () => {
    products.findManyByIds.mockResolvedValue([
      { ProductID: 30, SellerID: 4, Price: '500.00', IsForRent: true, Status: 'Available' },
    ]);
    orders.createWithItems.mockResolvedValue({ OrderID: 100, LifecycleState: 'PendingPayment' });

    const start = '2026-06-01';
    const end = '2026-06-08'; // 7 days
    const result = await svc.createOrder({
      buyerId: 1,
      dto: {
        type: 'Rent',
        items: [{ productId: 30, quantity: 1 }],
        rentStartDate: start, rentEndDate: end, dailyRate: 20,
      },
    });

    // 20 * 7 = 140 gross rent, deposit = 50% = 70 (≤ item value 500),
    // FinalAmount = 140 + 70 = 210
    expect(result.FinalAmount).toBe(210);
    expect(orders.createWithItems).toHaveBeenCalledWith(
      expect.objectContaining({
        orderType: 'Rent',
        rentDays: 7,
        dailyRate: 20,
        deposit: 70,
      }),
    );
  });

  it('rejects mixed-seller orders', async () => {
    products.findManyByIds.mockResolvedValue([
      { ProductID: 1, SellerID: 2, Price: 10, IsForRent: false, Status: 'Available' },
      { ProductID: 2, SellerID: 3, Price: 10, IsForRent: false, Status: 'Available' },
    ]);
    await expect(
      svc.createOrder({
        buyerId: 1,
        dto: { type: 'Buy', items: [{ productId: 1 }, { productId: 2 }] },
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejects buying your own item', async () => {
    products.findManyByIds.mockResolvedValue([
      { ProductID: 1, SellerID: 1, Price: 10, IsForRent: false, Status: 'Available' },
    ]);
    await expect(
      svc.createOrder({ buyerId: 1, dto: { type: 'Buy', items: [{ productId: 1 }] } }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejects requesting a Buy on a Rent-only listing', async () => {
    products.findManyByIds.mockResolvedValue([
      { ProductID: 1, SellerID: 2, Price: 10, IsForRent: true, Status: 'Available' },
    ]);
    await expect(
      svc.createOrder({ buyerId: 1, dto: { type: 'Buy', items: [{ productId: 1 }] } }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('transitions PendingPayment -> Paid via the state machine', async () => {
    orders.findById.mockResolvedValue({
      OrderID: 1, OrderType: 'Buy', LifecycleState: 'PendingPayment',
    });
    const next = await svc.transition(1, 'onPaymentSucceeded');
    expect(next).toBe('Paid');
    expect(orders.updateLifecycleState).toHaveBeenCalledWith(1, 'Paid');
  });

  it('rejects invalid transitions with 409', async () => {
    orders.findById.mockResolvedValue({
      OrderID: 1, OrderType: 'Buy', LifecycleState: 'PendingPayment',
    });
    await expect(svc.transition(1, 'onShip')).rejects.toMatchObject({ statusCode: 409 });
  });
});
