import test from 'node:test';import assert from 'node:assert/strict';
import {releaseOf,releaseKey} from '../src/domain/release.js';
import {MemoryStore} from '../src/infra/memory-store.js';
import {promoteRelease} from '../src/application/release-service.js';
test('release validates name',()=>assert.throws(()=>releaseOf({name:'',version:'1',build:1}),/name/));
test('release validates build',()=>assert.throws(()=>releaseOf({name:'x',version:'1',build:0}),/build/));
test('release key stable',()=>assert.equal(releaseKey({name:'p',version:'2',build:3}),'p@2+3'));
test('release promotion succeeds with healthy fake interface',async()=>{const stub={getMetadata:async()=>({status:'ready'}),fetchArtifact:async()=>({signature:'sig'})};const result=await promoteRelease({name:'p',version:'2',build:3},stub,new MemoryStore());assert.equal(result.signature,'sig')});
test('reject unsigned artifact',async()=>{const stub={getMetadata:async()=>({status:'ready'}),fetchArtifact:async()=>({})};await assert.rejects(()=>promoteRelease({name:'p',version:'2',build:3},stub,new MemoryStore()),/signature/)})
