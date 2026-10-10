'use strict';
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const configIndex = args.indexOf('--tsconfig');
const tsconfig = configIndex === -1 ? 'tsconfig.json' : args[configIndex + 1];
if (!tsconfig) { console.error('Missing --tsconfig value'); process.exit(2); }
const tscPath = path.join(root, 'node_modules/typescript/bin/tsc');
const vitePath = path.join(root, 'node_modules/vite/bin/vite.js');
for (const [commandArgs, label] of [[[tscPath, '--project', tsconfig, '--noEmit'], 'TypeScript'], [[vitePath, 'build'], 'Vite']]) {
  console.log(`[react-lab] ${label} build stage`);
  const result = spawnSync(process.execPath, commandArgs, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('[react-lab] React + Vite production build succeeded');
