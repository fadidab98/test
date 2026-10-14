import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {summarize} from '../src/services/orders.js';
test('fixture-backed order contract loads configured test data', async () => {
  const config = JSON.parse(await readFile(new URL('../config/test.profile.json', import.meta.url), 'utf8'));
  const fixture = resolve(process.cwd(), config.fixtures.baseDirectory, config.fixtures.orderFile);
  const order = JSON.parse(await readFile(fixture, 'utf8'));
  assert.deepEqual(summarize(order), {label:'customer-021:3900',lines:2});
});
