/**
 * Composition root for the Observer pattern. Call register() once
 * at server bootstrap with the live repositories so the bus is
 * wired before any webhook arrives.
 */
const eventBus = require('./EventBus');
const createOrderStateObserver = require('./OrderStateObserver');
const createInventoryObserver = require('./InventoryObserver');
const { createInventoryReleaseObserver } = require('./InventoryObserver');
const createNotificationObserver = require('./NotificationObserver');

function register({ orderRepository, productRepository, logger }) {
  eventBus.on(
    eventBus.EventBus.EVENTS
      ? eventBus.EventBus.EVENTS.PAYMENT_SUCCESS
      : 'PAYMENT_SUCCESS',
    createOrderStateObserver({ orderRepository }),
  );
  eventBus.on(
    'PAYMENT_SUCCESS',
    createInventoryObserver({ productRepository, orderRepository }),
  );
  eventBus.on(
    'ORDER_CANCELLED',
    createInventoryReleaseObserver({ productRepository, orderRepository }),
  );
  eventBus.on(
    'PAYMENT_SUCCESS',
    createNotificationObserver({ logger }),
  );
}

module.exports = { eventBus, register };
