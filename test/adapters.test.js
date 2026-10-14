import test from 'node:test';import assert from 'node:assert/strict';
import {memoryStore} from '../src/adapters/memory-store.js';
import {csvLines} from '../src/adapters/csv.js';
test('memory store returns snapshots',()=>{const store=memoryStore();store.save({id:'x'});assert.equal(store.list().length,1)});
test('CSV adapter exposes normalized columns',()=>assert.match(csvLines([{id:'x',amountCents:9}]),/id,amountCents/));
