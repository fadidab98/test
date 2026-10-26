import test from 'node:test';
import { readFileSync } from 'node:fs';
test('loads fixture', () => { readFileSync(new URL('./fixtures/missing.json', import.meta.url)); });
