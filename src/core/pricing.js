export function totalCents(lines) {
  if (!Array.isArray(lines)) throw new TypeError('Expected order lines');
  return lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
}
export function describeOrder(order) {
  return `${order.customerId}:${totalCents(order.lines)}`;
}
