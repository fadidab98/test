import test from 'node:test';import assert from 'node:assert/strict';
import {declaredStages,missingCopyStages,validateContainerStages} from '../src/application/container-plan.js';
test('parse multi-stage declarations',()=>assert.deepEqual(declaredStages('FROM node:20 AS foo\nFROM foo AS bar'),['foo','bar']));
test('valid stage copy',()=>assert.deepEqual(missingCopyStages('FROM node AS builder\nCOPY --from=builder /a /b'),[]));
test('detect unknown COPY source',()=>assert.deepEqual(missingCopyStages('FROM node AS builder\nCOPY --from=missing /a /b'),['missing']));
test('valid fixture passes',async()=>assert.equal(await validateContainerStages('fixtures/valid.Dockerfile'),true));
