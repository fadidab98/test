import { access } from 'node:fs/promises';
import { orderSummary } from '../src/order-service.mjs';

await access(new URL('../src/cli.mjs', import.meta.url));
const output = orderSummary({
  id: 'build-smoke',
  lines: [{ sku: 'sample', quantity: 1, unitPriceCents: 5000 }],
});
if (output.subtotalCents !== 5000 || output.shippingCents !== 0) {
  throw new Error('Build smoke check failed');
}
console.log('BUILD OK: source modules load and smoke checks pass');
