/**
 * Minimal in-process event bus. Observers are subscribed at server
 * bootstrap (see src/patterns/observer/index.js); business code
 * just emits events and never holds direct references to observers.
 *
 * Handlers are awaited sequentially so that an observer's failure
 * surfaces as a rejected promise to the caller (the webhook
 * handler). If you need fan-out tolerance later, swap to
 * Promise.allSettled.
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const arr = this.listeners.get(event);
    if (!arr) return;
    this.listeners.set(
      event,
      arr.filter((h) => h !== handler),
    );
  }

  async emit(event, payload) {
    const handlers = this.listeners.get(event) || [];
    for (const handler of handlers) {
      // eslint-disable-next-line no-await-in-loop
      await handler(payload);
    }
  }

  clear() {
    this.listeners.clear();
  }
}

// Application-wide events.
EventBus.EVENTS = Object.freeze({
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
});

module.exports = new EventBus();
module.exports.EventBus = EventBus;
