'use strict';
// Controlled build-tool minimum runtime, separate from package engines.
const required = 22;
const actual = Number.parseInt(process.versions.node.split('.')[0], 10);
if (actual < required) {
  console.error(`ERR_UNSUPPORTED_NODE_VERSION: React build tool requires Node.js >=${required}; found v${process.versions.node}`);
  process.exit(1);
}
console.log(`Build tool Node.js compatibility check passed: v${process.versions.node}`);
