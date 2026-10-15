import {test} from 'node:test';import assert from 'node:assert/strict';
import {createApplication} from '../apps/api/src/composition.mjs';
function setup(){return createApplication({logger:{info(){},warn(){}}})}
const request=()=>({customerId:'customer-a',lines:[{sku:'LAPTOP-14',quantity:2}]});
test('Saga confirms priced order',async()=>{const a=setup();const result=await a.workflow.submit(request());assert.equal(result.state,'CONFIRMED');assert.equal(result.quote.total.cents,213962)});
test('Saga reserves stock',async()=>{const a=setup();await a.workflow.submit(request());assert.equal(a.inventory.available('LAPTOP-14'),18)});
test('Saga persists confirmed orders',async()=>{const a=setup();await a.workflow.submit(request());assert.equal(a.orders.size(),1)});
test('Saga adds delivery event to outbox',async()=>{const a=setup();await a.workflow.submit(request());assert.equal(a.outbox.pendingCount(),1)});
test('Saga respects idempotency key',async()=>{const a=setup();const first=await a.workflow.submit(request(),{idempotencyKey:'fixed'});const next=await a.workflow.submit(request(),{idempotencyKey:'fixed'});assert.equal(first.id,next.id);assert.equal(a.inventory.available('LAPTOP-14'),18)});
test('Saga rejects out-of-stock request without partial reservation',async()=>{const a=setup();await assert.rejects(a.workflow.submit({customerId:'c',lines:[{sku:'LAPTOP-14',quantity:21}]}),/Insufficient/);assert.equal(a.inventory.available('LAPTOP-14'),20)});
test('Saga compensates after payment decline',async()=>{const a=setup();await assert.rejects(a.workflow.submit(request(),{paymentMode:'decline'}),/declined/);assert.equal(a.inventory.available('LAPTOP-14'),20);assert.equal(a.inventory.activeReservations(),0)});
test('Saga avoids persistent order after decline',async()=>{const a=setup();await assert.rejects(a.workflow.submit(request(),{paymentMode:'decline'}));assert.equal(a.orders.size(),0)});
test('Saga records failed order metric',async()=>{const a=setup();await assert.rejects(a.workflow.submit(request(),{paymentMode:'decline'}));assert.equal(a.metrics.snapshot().counters.orders_failed_total,1)});
test('Saga publishes confirmation on outbox flush',async()=>{const a=setup();await a.workflow.submit(request());await a.outbox.drain(a.bus);assert.equal(a.journal.length,1);assert.equal(a.journal.verify(),true)});
