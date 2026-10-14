import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStore } from '../src/infra/memory-store.js';
import { submitOrder } from '../src/application/submit-order.js';
import { dispatchReceipt } from '../src/application/dispatch.js';
import { FakeGateway } from '../src/infra/notifications/fake-gateway.js';
test('integration: completed order is rendered and emailed', async () => {
  const store=new MemoryStore(); const gateway=new FakeGateway();
  submitOrder(store,{id:'CASE-01',customer:'hello@example.test',quantity:2,unitPrice:80});
  const outcome=await dispatchReceipt(store,'CASE-01',gateway);
  assert.match(outcome.body,/CASE-01/);
  assert.equal(gateway.sent.length,1);
});
