import test from 'node:test';
import assert from 'node:assert/strict';
import { totalCents } from '../src/pricing.mjs';
test('calculates the order total', () => {
  assert.equal(totalCents(3, 250), 750);
});
