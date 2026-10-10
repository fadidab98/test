'use strict';
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const main = path.resolve(__dirname, '..', 'src', 'app.js');
const result = spawnSync(process.execPath, ['--check', main], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
// Execute source as well as syntax-check it, catching genuinely unresolved imports.
require(main);
console.log('Node source check and build completed');
