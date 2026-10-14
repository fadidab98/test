import test from 'node:test';import assert from 'node:assert/strict';
import {validateContainerStages} from '../src/application/container-plan.js';
test('integration: production Dockerfile resolves all named stages',async()=>{
  assert.equal(await validateContainerStages('Dockerfile'),true);
});
