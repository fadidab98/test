import test from 'node:test';
import assert from 'node:assert/strict';
import { submitOrder } from '../src/application/submit-order.js';
import { MemoryStore } from '../src/infra/memory-store.js';
test('submit saves total and shipping', () => {const s=new MemoryStore();const o=submitOrder(s,{id:'K1',customer:'x@y.test',quantity:2,unitPrice:70});assert.equal(o.total,140);assert.equal(s.get('K1').shipping,'express')});
test('reject invalid customer', () => assert.throws(() => submitOrder(new MemoryStore(),{id:'K',customer:'',quantity:1,unitPrice:9}),/customer/));
