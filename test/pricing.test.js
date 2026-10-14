import test from 'node:test';
import assert from 'node:assert/strict';
import {totalCents,describeOrder} from '../src/core/pricing.js';
test('pricing totals', () => assert.equal(totalCents([{unitPriceCents:500,quantity:2}]),1000));
test('order label', () => assert.equal(describeOrder({customerId:'x',lines:[]}), 'x:0'));
