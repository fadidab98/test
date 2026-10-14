import test from 'node:test';
import assert from 'node:assert/strict';
import {validateOrder} from '../src/core/validation.js';
test('valid order', () => assert.equal(validateOrder({customerId:'x',lines:[]}),true));
test('missing customer rejected', () => assert.throws(()=>validateOrder({lines:[]}),/customerId/));
