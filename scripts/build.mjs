import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', '<!doctype html><title>Dashboard</title><h1>Dashboard</h1>');
console.log('Build output created: dist/index.html');
