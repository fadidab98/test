import test from 'node:test';import assert from 'node:assert/strict';import {retry} from '../src/application/retry.js';
test('retries transient failures',async()=>{let n=0;assert.equal(await retry(()=>{n++;if(n<3)throw new Error('retry');return n}),3)});
