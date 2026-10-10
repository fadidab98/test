'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { add } = require('../src/app.cjs');
test('add works', () => assert.equal(add(2, 3), 5));
