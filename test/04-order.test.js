import test from 'node:test';import assert from 'node:assert/strict';import {aggregateOrder} from '../src/domain/order.js';
test('order projection totals events',()=>assert.deepEqual(aggregateOrder([{orderId:'A',amountCents:100},{orderId:'A',amountCents:200}]),{orderId:'A',totalCents:300,eventCount:2}));
