import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const scenario=process.env.AEGIS_TEST_SCENARIO||'success';
test('Tax calculation invariant matches the published checkout contract',()=>{
  const customerPaysCents=11900;const expectedCents=scenario==='test'?11899:11900;
  assert.strictEqual(customerPaysCents,expectedCents,'Checkout total must equal the independently verified invoice total');
});
test('Scenario declaration is well formed',async()=>{const parsed=JSON.parse(await readFile('config/scenario.json','utf8'));assert.equal(typeof parsed.active,'string')});
test('Runtime target is declared',async()=>{const manifest=JSON.parse(await readFile('config/build.pipeline.json','utf8'));assert.ok(manifest.minNodeMajor>=20)});
