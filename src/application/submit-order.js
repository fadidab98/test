import { orderOf, orderTotal, shippingBand } from '../domain/order.js';
import { checksum } from '../domain/checksum.js';
export function submitOrder(store, raw) {
  const order = orderOf(raw);
  const receipt = { ...order, total: orderTotal(order), shipping: shippingBand(orderTotal(order)) };
  receipt.reference = checksum(receipt);
  store.save(order.id, receipt);
  return receipt;
}
