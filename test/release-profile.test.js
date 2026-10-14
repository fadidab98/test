import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('CI release profile target is supported by build toolchain', () => {
  const profile=JSON.parse(readFileSync(new URL('../config/release.profile.json',import.meta.url),'utf8'));
  const supported=JSON.parse(readFileSync(new URL('../config/supported-targets.json',import.meta.url),'utf8'));
  assert.ok(supported.moduleFormats.includes(profile.target.moduleFormat),
    `Release profile target.moduleFormat='${profile.target.moduleFormat}' is not a supported output format. `+
    `Expected one of: ${supported.moduleFormats.join(', ')}`);
});
