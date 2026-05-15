/**
 * Observer #2: decrements stock once the payment is confirmed.
 * For rental items we mark them Pending (not Sold) so they return
 * to the catalogue when the rental completes; for sell items we
 * decrement stock and flip them to Sold when stock hits zero.
 */
function createInventoryObserver({ productRepository, orderRepository }) {
  return async function handlePaymentSuccess(payload) {
    const { orderId } = payload;
    const order = await orderRepository.findById(orderId);
    if (!order) return;
    const items = await orderRepository.findItemsByOrderId(orderId);

    for (const item of items) {
      // eslint-disable-next-line no-await-in-loop
      await productRepository.decrementStock(
        item.ProductID,
        item.Quantity,
        order.OrderType === 'Rent',
      );
    }
  };
}

module.exports = createInventoryObserver;
