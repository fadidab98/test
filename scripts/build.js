import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const files = ['src/core/pricing.js', 'src/core/validation.js', 'src/services/orders.js', 'src/server.js'];
for (const file of files) execFileSync(process.execPath, ['--check', file], {stdio:'pipe'});
mkdirSync('dist', { recursive: true });
writeFileSync('dist/build-summary.json', JSON.stringify({ checked: files.length }));
console.log('[build] All JavaScript modules checked. Build succeeded.');
