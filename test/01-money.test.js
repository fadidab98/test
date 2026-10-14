import test from 'node:test';import assert from 'node:assert/strict';import {cents} from '../src/domain/money.js';
test('money conversion',()=>assert.equal(cents(3.5),350));
test('invalid money rejected',()=>assert.throws(()=>cents(-1),/Invalid/));
