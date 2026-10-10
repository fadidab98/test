'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
let config;
try {
  config = JSON.parse(fs.readFileSync(path.join(root, 'tests/test-settings.json'), 'utf8'));
} catch (error) {
  console.error(`Invalid React test configuration at tests/test-settings.json: ${error.message}`);
  process.exit(2);
}
if (config.runner !== 'node:test' || !Array.isArray(config.include) || config.include.length === 0) {
  console.error('Invalid React test configuration: expected runner=node:test and nonempty include');
  process.exit(2);
}
for (const name of config.include) {
  if (typeof name !== 'string' || !/^tests\/[a-zA-Z0-9_.-]+\.test\.js$/.test(name)) {
    console.error(`Invalid test path in tests/test-settings.json: ${name}`);
    process.exit(2);
  }
  if (!fs.existsSync(path.join(root, name))) {
    console.error(`Test configuration references a missing test file: ${name}`);
    process.exit(2);
  }
}
const result = spawnSync(process.execPath, ['--test', ...config.include], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
