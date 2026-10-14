import test from 'node:test';
import assert from 'node:assert/strict';
import { subtotalCents, orderSummary } from '../src/order-service.mjs';

test('empty order has zero subtotal', () => {
  assert.equal(subtotalCents([]), 0);
});

test('shipping becomes free at 50 EUR', () => {
  const summary = orderSummary({ id: 'H-10', lines: [{ sku: 'a', quantity: 1, unitPriceCents: 5000 }] });
  assert.equal(summary.shippingCents, 0);
});
