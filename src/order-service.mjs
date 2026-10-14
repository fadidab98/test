/** Calculate order totals in integer cents to avoid floating-point drift. */
export function subtotalCents(lines) {
  if (!Array.isArray(lines)) throw new TypeError('Order lines must be an array');
  return lines.reduce((total, line) => {
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new RangeError('Each quantity must be a positive integer');
    }
    if (!Number.isInteger(line.unitPriceCents) || line.unitPriceCents < 0) {
      throw new RangeError('Each unitPriceCents must be a non-negative integer');
    }
    return total + line.quantity * line.unitPriceCents;
  }, 0);
}

export function orderSummary(order) {
  if (typeof order?.id !== 'string' || !order.id.trim()) {
    throw new TypeError('An order id is required');
  }
  const subtotal = subtotalCents(order.lines);
  return {
    orderId: order.id,
    itemCount: order.lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotalCents: subtotal,
    shippingCents: subtotal >= 5000 ? 0 : 450,
  };
}
