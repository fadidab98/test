import test from 'node:test';import assert from 'node:assert/strict';
import {appendEvent} from '../src/application/audit-stream.js';
import {exportBatch} from '../src/application/export-batch.js';
import {MemoryStore} from '../src/infra/memory-store.js';
test('integration: CSV plugin parses and exports audit records',async()=>{
  const s=new MemoryStore();appendEvent(s,{id:'e1',event:'opened',sequence:1});appendEvent(s,{id:'e2',event:'closed',sequence:2});
  assert.match(await exportBatch(s,['e1','e2'],'csv'),/e1,opened,1/);
});
