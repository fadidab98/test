import test from 'node:test';
import assert from 'node:assert/strict';
import { formatMessage } from '../src/main.mjs';

test('formats a greeting', () => {
  assert.equal(formatMessage('DevOps'), 'Hello DevOps');
});
