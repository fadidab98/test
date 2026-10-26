import { mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
for (const f of ['src/math.js', 'src/main.js']) execFileSync(process.execPath, ['--check', f], {stdio:'inherit'});
mkdirSync('dist', {recursive:true});
for (const f of ['math.js', 'main.js']) copyFileSync('src/'+f, 'dist/'+f);
console.log('Build complete');
await import('../src/main.js');
