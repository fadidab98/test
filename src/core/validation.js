export function validateOrder(order) {
  if (!order || !Array.isArray(order.lines)) throw new Error('Order must have lines');
  if (!order.customerId) throw new Error('Order must have customerId');
  return true;
}
