import { describeOrder } from '../core/pricing.js';
import { validateOrder } from '../core/validation.js';
export function summarize(order) {
  validateOrder(order);
  return { label: describeOrder(order), lines: order.lines.length };
}
