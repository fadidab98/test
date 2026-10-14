import test from 'node:test';import assert from 'node:assert/strict';
import {startRegistry} from '../src/infra/registry/fake-registry-server.js';
import {RegistryClient} from '../src/infra/registry/registry-client.js';
import {promoteRelease} from '../src/application/release-service.js';
import {MemoryStore} from '../src/infra/memory-store.js';
test('integration: release promotion fetches manifest from internal registry',async()=>{
  const registry=await startRegistry();
  try {
    const client=new RegistryClient(registry.baseUrl);
    const promoted=await promoteRelease({name:'payments',version:'2.3.0',build:17},client,new MemoryStore());
    assert.equal(promoted.signature,'approved-signature');
  } finally {await registry.close();}
});
