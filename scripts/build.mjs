import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { assertNodeRuntime } from './runtime-check.mjs';
const requirements = JSON.parse(await readFile(new URL('../runtime-requirements.json', import.meta.url), 'utf8'));
assertNodeRuntime(process.version, requirements.minimumNodeMajor);
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', '<!doctype html><title>Runtime check</title><h1>Runtime requirement satisfied</h1>');
console.log(`Build succeeded with ${process.version}`);
