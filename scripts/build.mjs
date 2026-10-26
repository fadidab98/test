import { mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
for (const f of ['src/math.mjs', 'src/main.mjs']) execFileSync(process.execPath, ['--check', f], {stdio:'inherit'});
mkdirSync('dist', {recursive:true});
for (const f of ['math.mjs', 'main.mjs']) copyFileSync('src/'+f, 'dist/'+f);
console.log('Build complete');
