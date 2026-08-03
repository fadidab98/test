import test from 'node:test';
import assert from 'node:assert/strict';
import { nextAction, summarizePipeline } from '../src/pipelineSummary.js';

test('summarizes successful pipeline steps', () => {
  const summary = summarizePipeline([
    { step_id: 'install', status: 'SUCCEEDED' },
    { step_id: 'test', status: 'SUCCEEDED' },
    { step_id: 'build', status: 'SUCCEEDED' }
  ]);

  assert.deepEqual(summary, {
    total: 3,
    failed: 0,
    succeeded: 3,
    skipped: 0,
    success_rate: 1
  });
  assert.equal(nextAction(summary), 'ready');
});

test('prioritizes failed pipeline steps', () => {
  const summary = summarizePipeline([
    { step_id: 'install', status: 'SUCCEEDED' },
    { step_id: 'test', status: 'FAILED' },
    { step_id: 'build', status: 'SKIPPED' }
  ]);

  assert.equal(summary.failed, 1);
  assert.equal(summary.skipped, 1);
  assert.equal(summary.success_rate, 0.33);
  assert.equal(nextAction(summary), 'inspect_failure');
});
