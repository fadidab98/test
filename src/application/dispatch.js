import { renderDeliveryNotice } from '../infra/notifications/renderer-adapter.js';
export async function dispatchReceipt(store, orderId, gateway) {
  const order = store.get(orderId);
  if (!order) throw new Error(`Missing order: ${orderId}`);
  const body = await renderDeliveryNotice({ id: order.id, total: order.total, recipient: order.customer });
  return gateway.send(order.customer, body);
}
