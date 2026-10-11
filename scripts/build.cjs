"use strict";
const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const assert = require("node:assert/strict");
const { total } = require("../src/total.cjs");

// This is a real, quick build-stage smoke check, not a no-op.
assert.equal(total([10, 20, 30]), 60);
mkdirSync(join(__dirname, "..", "dist"), { recursive: true });
writeFileSync(join(__dirname, "..", "dist", "build-manifest.json"),
  JSON.stringify({ name: "manual-fix-node-dependency-lab", built: true }, null, 2) + "\n");
console.log("BUILD SUCCESS: src/total.cjs passed the build smoke check");
