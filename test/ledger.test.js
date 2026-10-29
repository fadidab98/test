import test from 'node:test';
import assert from 'node:assert/strict';
import { totalHours } from '../src/ledger.js';
test('sums task hours', () => assert.equal(totalHours([{hours:2},{hours:3}]),99));
test('empty project has zero hours', () => assert.equal(totalHours([]),0));
test('rejects invalid hours', () => assert.throws(() => totalHours([{hours:-1}]),TypeError));
