import test from 'node:test';import assert from 'node:assert/strict';
import {startRegistry} from '../src/infra/registry/fake-registry-server.js';
import {RegistryClient} from '../src/infra/registry/registry-client.js';
test('local registry has reachable health endpoint',async()=>{const s=await startRegistry();try{const r=await fetch(s.baseUrl+'/health');assert.equal(r.status,200)}finally{await s.close()}});
test('registry metadata available',async()=>{const s=await startRegistry();try{const m=await new RegistryClient(s.baseUrl).getMetadata();assert.equal(m.status,'ready')}finally{await s.close()}});
