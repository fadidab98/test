import test from 'node:test';import assert from 'node:assert/strict';import {uniqueEvents} from '../src/application/dedupe.js';
test('duplicate event ids removed',()=>assert.equal(uniqueEvents([{id:'x'},{id:'x'},{id:'y'}]).length,2));
