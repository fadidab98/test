import test from 'node:test';import assert from 'node:assert/strict';import {healthReport} from '../src/monitoring/health.js';
test('health report format',()=>assert.equal(healthReport({serviceId:'demo'}).status,'ok'));
