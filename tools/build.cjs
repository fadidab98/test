'use strict';
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const tsc = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
const configuration = process.argv.includes('--tsconfig')
  ? process.argv[process.argv.indexOf('--tsconfig') + 1]
  : 'tsconfig.json';
if (!configuration) {
  console.error('Missing --tsconfig argument');
  process.exit(2);
}
const compile = spawnSync(process.execPath, [tsc, '--project', configuration, '--noEmit'], {
  stdio: 'inherit', cwd: root
});
if (compile.error) throw compile.error;
if (compile.status !== 0) process.exit(compile.status ?? 1);
const source = path.join(root, 'src', 'app.cjs');
const parsed = spawnSync(process.execPath, ['--check', source], { stdio: 'inherit', cwd: root });
if (parsed.error) throw parsed.error;
if (parsed.status !== 0) process.exit(parsed.status ?? 1);
require(source);
console.log('Node.js + TypeScript build succeeded');
