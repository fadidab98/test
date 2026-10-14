import test from 'node:test';import assert from 'node:assert/strict';
import {bootstrapWorker} from '../src/runtime/worker-bootstrap.js';
import {verifyRuntimePolicy} from '../src/runtime/compatibility.js';
test('runtime policy is satisfied by actual CI runner',()=>{
  const info=verifyRuntimePolicy();
  assert.ok(info.actual>=info.required);
});
test('worker starts and processes events on supported production runtime',async()=>{
  const processed=await bootstrapWorker([[{id:'delivery-1',kind:'paid',orderId:'o-9',amountCents:640}]]);
  assert.equal(processed[0].totalCents,640);
});
