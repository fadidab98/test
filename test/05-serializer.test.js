import test from 'node:test';import assert from 'node:assert/strict';import {serialize,deserialize} from '../src/adapters/json-serializer.js';
test('JSON round-trip',()=>assert.deepEqual(deserialize(serialize({x:1})),{x:1}));
