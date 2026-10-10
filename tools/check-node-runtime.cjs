'use strict';

// Controlled diagnostic fixture: a build tool that requires Node.js >=22.
// The root application still supports Node.js 20 so platform preflight can run.
const minimumMajor = 22;
const actualMajor = Number(process.versions.node.split('.')[0]);

if (!Number.isInteger(actualMajor) || actualMajor < minimumMajor) {
  console.error(
    `ERR_UNSUPPORTED_NODE_VERSION: build tool requires Node.js >=${minimumMajor}; detected ${process.version}`
  );
  process.exit(1);
}
