import test from 'node:test';
import assert from 'node:assert/strict';
import { total } from '../src/ledger.js';
test('total work hours', () => assert.equal(total([{hours:2},{hours:3}]),99));
