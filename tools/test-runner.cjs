'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'tests', 'test-settings.json');
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error(`Invalid test configuration at tests/test-settings.json: ${error.message}`);
  process.exit(2);
}
if (config.runner !== 'node:test' || !Array.isArray(config.include) || !config.include.length) {
  console.error('Invalid test configuration: runner must be node:test and include must be nonempty');
  process.exit(2);
}
for (const name of config.include) {
  if (typeof name !== 'string' || !name.startsWith('tests/') || name.includes('..')) {
    console.error(`Invalid test path in test-settings.json: ${name}`);
    process.exit(2);
  }
}
const result = spawnSync(process.execPath, ['--test', ...config.include], { stdio: 'inherit', cwd: root });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
