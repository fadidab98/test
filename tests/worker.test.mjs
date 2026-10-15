import {test} from 'node:test';import assert from 'node:assert/strict';
import {NotificationWorker} from '../apps/worker/src/handler.mjs';
import {EVENT_TYPES,envelope} from '@aegis/contracts';
test('Worker sends notifications after confirmation',async()=>{let count=0;const w=new NotificationWorker({transport:async()=>count++});await w.process(envelope(EVENT_TYPES.CONFIRMED,{orderId:'o-1'}));assert.equal(count,1)});
test('Worker deduplicates repeated event ID',async()=>{let count=0;const w=new NotificationWorker({transport:async()=>count++});const e=envelope(EVENT_TYPES.CONFIRMED,{orderId:'o-1'});await w.process(e);await w.process(e);assert.equal(count,1)});
test('Worker ignores non-confirmation events',async()=>{const w=new NotificationWorker();assert.equal((await w.process(envelope(EVENT_TYPES.FAILED,{}))).ignored,true)});
test('Worker rejects missing order ID',async()=>{const w=new NotificationWorker();await assert.rejects(w.process(envelope(EVENT_TYPES.CONFIRMED,{})),/requires orderId/)});
test('Worker retries after external transport failure',async()=>{let failed=true;let count=0;const w=new NotificationWorker({transport:async()=>{count++;if(failed){failed=false;throw Error('outage')}}});const e=envelope(EVENT_TYPES.CONFIRMED,{orderId:'o-1'});await assert.rejects(w.process(e));await w.process(e);assert.equal(count,2)});
