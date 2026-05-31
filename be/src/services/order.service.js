const AppError = require('../utils/AppError');
const OrderFactory = require('../patterns/factory/OrderFactory');
const OrderStateMachine = require('../patterns/state/OrderStateMachine');
const { eventBus } = require('../patterns/observer');

const PAYMENT_WINDOW_MS = 2 * 60 * 60 * 1000;

class OrderService {
  constructor({
    orderRepository,
    productRepository,
    paymentRepository,
    orderFactory = OrderFactory,
  }) {
    this.orders = orderRepository;
    this.products = productRepository;
    this.payments = paymentRepository;
    this.factory = orderFactory;
  }

  isPendingPaymentExpired(order) {
    if (!order || order.LifecycleState !== 'PendingPayment') return false;
    const createdAt = new Date(order.CreatedAt).getTime();
    return Number.isFinite(createdAt) && Date.now() - createdAt > PAYMENT_WINDOW_MS;
  }

  async expirePendingPaymentIfNeeded(order) {
    if (!this.isPendingPaymentExpired(order)) return order;
    await this.orders.updateLifecycleState(order.OrderID, 'Cancelled');
    await eventBus.emit('ORDER_CANCELLED', {
      orderId: order.OrderID,
      reason: 'payment_expired',
    });
    return {
      ...order,
      LifecycleState: 'Cancelled',
      UpdatedAt: new Date().toISOString(),
    };
  }

  toClientOrder(order) {
    if (!order) return order;
    const paymentDueAt = order.PaymentDueAt
      || new Date(new Date(order.CreatedAt).getTime() + PAYMENT_WINDOW_MS).toISOString();
    return {
      ...order,
      PaymentDueAt: paymentDueAt,
      CanRetryPayment: order.LifecycleState === 'PendingPayment',
    };
  }

  /**
   * Builds an order through the Factory, hydrates UnitPrice from the
   * authoritative Products table (callers can't choose their own
   * price), and hands the payload to the repository for an ACID
   * insert of Orders + OrderItems.
   */
  async createOrder({ buyerId, dto }) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.products.findManyByIds(productIds);
    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found', 404);
    }

    // Single-seller invariant (matches Orders.CK_Ord_NotSelf & C2C model).
    const sellerIds = new Set(products.map((p) => p.SellerID));
    if (sellerIds.size > 1) {
      throw new AppError('All items in an order must share one seller', 400);
    }
    const [sellerId] = sellerIds;
    if (sellerId === buyerId) {
      throw new AppError('You cannot buy your own item', 400);
    }

    // Enforce IsForRent matches the requested order type.
    const wantsRent = (dto.type || 'Buy').toLowerCase() === 'rent';
    for (const p of products) {
      if (!!p.IsForRent !== wantsRent) {
        throw new AppError(
          `Product ${p.ProductID} is not available as ${wantsRent ? 'rent' : 'buy'}`,
          400,
        );
      }
      if (p.Status !== 'Available') {
        throw new AppError(`Product ${p.ProductID} is not available`, 409);
      }
    }

    for (const item of dto.items) {
      const reserved = await this.products.reserveForOrder(
        item.productId,
        item.quantity || 1,
      );
      if (!reserved) {
        throw new AppError(
          `Product ${item.productId} has just been reserved by another buyer`,
          409,
        );
      }
    }

    const itemsWithPrice = dto.items.map((i) => {
      const prod = products.find((p) => p.ProductID === i.productId);
      return {
        productId: prod.ProductID,
        quantity: i.quantity || 1,
        unitPrice: Number(prod.Price),
      };
    });

    const order = this.factory.create(dto.type, {
      buyerId,
      sellerId,
      note: dto.note,
      items: itemsWithPrice,
      rentStartDate: dto.rentStartDate,
      rentEndDate: dto.rentEndDate,
      dailyRate: dto.dailyRate,
    });

    try {
      const persisted = await this.orders.createWithItems(order.toPersistencePayload());
      return this.toClientOrder({
        ...persisted,
        FinalAmount: order.getFinalAmount(),
        Subtotal: order.getSubtotal(),
      });
    } catch (error) {
      for (const item of dto.items) {
        // eslint-disable-next-line no-await-in-loop
        await this.products.releaseReservation(item.productId);
      }
      throw error;
    }
  }

  /**
   * Synchronous transition helper used by REST endpoints (e.g.
   * seller hits "ship"). The webhook handler bypasses this and
   * goes through the EventBus instead.
   */
  async getOrders(userId, role) {
    const orders = await this.orders.findByUser(userId, role);
    const normalized = [];
    for (const order of orders) {
      // eslint-disable-next-line no-await-in-loop
      const activeOrder = await this.expirePendingPaymentIfNeeded(order);
      normalized.push(this.toClientOrder(activeOrder));
    }
    return normalized;
  }

  async getOrder(orderId) {
    const order = await this.orders.findByIdWithItems(orderId);
    if (!order) throw new AppError('Order not found', 404);
    const activeOrder = await this.expirePendingPaymentIfNeeded(order);
    return this.toClientOrder(activeOrder);
  }

  async transition(orderId, event) {
    const order = await this.orders.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    if (this.isPendingPaymentExpired(order)) {
      await this.expirePendingPaymentIfNeeded(order);
      throw new AppError('The payment window has expired and the order was cancelled', 409);
    }

    const sm = new OrderStateMachine({
      orderId: order.OrderID,
      orderType: order.OrderType,
      currentState: order.LifecycleState,
    });
    const next = sm.dispatch(event);
    await this.orders.updateLifecycleState(orderId, next);
    if (next === 'Cancelled') {
      await eventBus.emit('ORDER_CANCELLED', { orderId, reason: 'order_cancelled' });
    }
    let settlement = null;
    if (next === 'Completed' && order.IsPaid && this.payments) {
      settlement = await this.payments.releaseEscrowForOrder(orderId);
    }
    return { lifecycleState: next, settlement };
  }
}

module.exports = OrderService;
