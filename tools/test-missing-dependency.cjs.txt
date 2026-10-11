"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
// INTENTIONAL CI FAILURE: package.json has no `is-number` dependency.
// Manual fix in the platform: install-node-transient-package, is-number@7.0.0.
const isNumber = require("is-number");
const { total } = require("../src/total.cjs");

test("total returns the sum of valid numeric values", () => {
  assert.equal(isNumber(3), true);
  assert.equal(total([1, 2, 3]), 6);
});

test("total rejects invalid values", () => {
  assert.throws(() => total([1, "bad"]), TypeError);
});
