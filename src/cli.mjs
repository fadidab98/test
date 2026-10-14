import { orderSummary } from './order-service.mjs';

const example = orderSummary({
  id: 'sample-42',
  lines: [{ sku: 'notebook', quantity: 2, unitPriceCents: 1299 }],
});

console.log(JSON.stringify(example, null, 2));
