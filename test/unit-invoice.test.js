import test from 'node:test';import assert from 'node:assert/strict';
import {invoice,taxCents} from '../src/domain/invoice.js';
import {MemoryStore} from '../src/infra/memory-store.js';
import {createInvoice} from '../src/application/create-invoice.js';
test('invoice id normalized',()=>assert.equal(invoice({id:'  X ',customer:'c',cents:20}).id,'X'));
test('invoice positive cents',()=>assert.throws(()=>invoice({id:'X',customer:'c',cents:0}),/positive/));
test('tax rounded',()=>assert.equal(taxCents(105,19),20));
test('invoice persist',()=>{const s=new MemoryStore();assert.equal(createInvoice(s,{id:'A',customer:'x',cents:100}).tax,19);assert.equal(s.count(),1)});
