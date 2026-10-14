import test from 'node:test';import assert from 'node:assert/strict';
import {appendEvent} from '../src/application/audit-stream.js';
import {exportBatch} from '../src/application/export-batch.js';
import {MemoryStore} from '../src/infra/memory-store.js';
test('JSONL export path',async()=>{const s=new MemoryStore();appendEvent(s,{id:'e1',event:'hello',sequence:1});assert.match(await exportBatch(s,['e1'],'jsonl'),/"event":"hello"/)});
test('unsupported export gives error',async()=>await assert.rejects(()=>exportBatch(new MemoryStore(),[],'pdf'),/Unsupported/));
