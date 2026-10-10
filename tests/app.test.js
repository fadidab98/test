'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { add } = require('../src/math');
test('add returns the sum', () => {
  assert.equal(add(2, 3), 5);
});
