import test from 'node:test';import assert from 'node:assert/strict';
import {transformBatch} from '../src/application/transform.js';
import {dailyReport} from '../src/application/report.js';
test('transforms invoice batch',()=>assert.equal(transformBatch([{id:'X',amount:3}])[0].amountCents,300));
test('report totals cents',()=>assert.deepEqual(dailyReport([{amountCents:400},{amountCents:600}]),{count:2,totalCents:1000}));
