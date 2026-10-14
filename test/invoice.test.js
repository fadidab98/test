import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeInvoice,validateInvoice} from '../src/domain/invoice.js';
test('normalizes amounts',()=>assert.deepEqual(normalizeInvoice({id:' A 1 ',amount:2.31}),{id:'a-1',amountCents:231}));
test('rejects invalid invoice',()=>assert.throws(()=>validateInvoice({id:'',amount:1}),/Invalid/));
