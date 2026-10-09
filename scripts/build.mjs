import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', '<!doctype html><title>Order dashboard</title><h1>Order dashboard</h1>');
console.log('Build output created: dist/index.html');
