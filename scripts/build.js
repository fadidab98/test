import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { totalHours } from '../src/ledger.js';
mkdirSync('dist', { recursive: true });
copyFileSync('src/ledger.js', 'dist/ledger.js');
copyFileSync('src/main.js', 'dist/main.js');
writeFileSync('dist/summary.json', JSON.stringify({totalHours: totalHours([{hours: 2}, {hours: 3}])}) + '\n');
console.log('Build completed: dist/main.js and dist/summary.json');
