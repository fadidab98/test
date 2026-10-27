import test from 'node:test';
import { readFileSync } from 'node:fs';
test('load task fixture', () => JSON.parse(readFileSync(new URL('./fixtures/tasks.json',import.meta.url),'utf8')));
