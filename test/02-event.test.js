import test from 'node:test';import assert from 'node:assert/strict';import {canonicalEvent} from '../src/domain/event.js';
test('event kind normalization',()=>assert.equal(canonicalEvent({id:'1',kind:'added'}).kind,'ADDED'));
