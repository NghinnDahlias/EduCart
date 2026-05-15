const AppError = require('../utils/AppError');
const OrderFactory = require('../patterns/factory/OrderFactory');
const OrderStateMachine = require('../patterns/state/OrderStateMachine');

class OrderService {
  constructor({ orderRepository, productRepository, orderFactory = OrderFactory }) {
    this.orders = orderRepository;
    this.products = productRepository;
    this.factory = orderFactory;
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

    const persisted = await this.orders.createWithItems(order.toPersistencePayload());
    return {
      ...persisted,
      FinalAmount: order.getFinalAmount(),
      Subtotal: order.getSubtotal(),
    };
  }

  /**
   * Synchronous transition helper used by REST endpoints (e.g.
   * seller hits "ship"). The webhook handler bypasses this and
   * goes through the EventBus instead.
   */
  async getOrders(userId, role) {
    return this.orders.findByUser(userId, role);
  }

  async getOrder(orderId) {
    const order = await this.orders.findByIdWithItems(orderId);
    if (!order) throw new AppError('Order not found', 404);
    return order;
  }

  async transition(orderId, event) {
    const order = await this.orders.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    const sm = new OrderStateMachine({
      orderId: order.OrderID,
      orderType: order.OrderType,
      currentState: order.LifecycleState,
    });
    const next = sm.dispatch(event);
    await this.orders.updateLifecycleState(orderId, next);
    return next;
  }
}

module.exports = OrderService;
