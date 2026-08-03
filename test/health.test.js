import test from 'node:test';
import assert from 'node:assert/strict';
import { createHealthReport, isHealthy } from '../src/health.js';

test('creates a healthy service report', () => {
  const report = createHealthReport({
    serviceName: 'demo-api',
    version: '1.0.0',
    uptimeSeconds: 42.9
  });

  assert.deepEqual(report, {
    service: 'demo-api',
    status: 'ok',
    version: '1.0.0',
    uptime_seconds: 42
  });
  assert.equal(isHealthy(report), true);
});

test('rejects reports without a service name', () => {
  assert.equal(isHealthy({ status: 'ok' }), false);
});
