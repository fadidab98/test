const test = require('node:test');
const assert = require('node:assert/strict');
const { add } = require('../scripts/math.cjs');
test('adds', { timeout: 50 }, async () => { await new Promise(resolve => setTimeout(resolve, 200)); assert.equal(add(2, 3), 5); });
