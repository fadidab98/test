const test = require('node:test');
const assert = require('node:assert/strict');
const { add } = require('../scripts/math.cjs');
test('adds', () => assert.equal(add(2, 3), 5));
