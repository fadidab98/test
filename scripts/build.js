import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
// CI syntax-checks the entrypoint/core. Optional adapters are loaded by integration tests.
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let result = [];
  for (const e of entries) result.push(...(e.isDirectory() ? await walk(join(dir, e.name)) : e.name.endsWith('.js') ? [join(dir,e.name)] : []));
  return result;
}
for (const file of await walk('src/domain')) {
  const run = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (run.status !== 0) { console.error(run.stderr); process.exit(run.status || 1); }
}
console.log('Build preflight OK: core domain modules syntax-checked');
