import { nonEmpty, positiveInteger } from './validation.js';
export function orderOf(raw) {
  return { id: nonEmpty(raw.id, 'id'), customer: nonEmpty(raw.customer, 'customer'),
    quantity: positiveInteger(raw.quantity, 'quantity'), unitPrice: positiveInteger(raw.unitPrice, 'unitPrice') };
}
export function orderTotal(order) { return order.quantity * order.unitPrice; }
export function shippingBand(total) { return total >= 100 ? 'express' : 'standard'; }
