import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const write = (name, value) => {
  const file = path.join(root, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, 'utf8');
};
const catalog = JSON.parse(read('scenarios/catalog.json'));
const arg = process.argv[2];

if (arg === '--list') {
  for (const item of catalog) {
    console.log(`${item.id.padEnd(35)} ${item.expected_category.padEnd(35)} ${item.expected_stage}`);
  }
  process.exit(0);
}
if (arg === '--status') {
  console.log(read('experiment.json'));
  process.exit(0);
}
if (!arg || arg === '--help' || arg === '-h') {
  console.log('Usage: node tools/activate-scenario.mjs --list');
  console.log('       node tools/activate-scenario.mjs --reset');
  console.log('       node tools/activate-scenario.mjs <scenario-id>');
  console.log('       node tools/activate-scenario.mjs --status');
  process.exit(arg ? 0 : 2);
}
const id = arg === '--reset' ? 'baseline' : arg;
const scenario = catalog.find((item) => item.id === id);
if (!scenario) {
  console.error(`Unknown scenario '${id}'. Run: node tools/activate-scenario.mjs --list`);
  process.exit(2);
}
if (!fs.existsSync(path.join(root, '.lab-root'))) {
  console.error('Lab marker missing. Activate scenarios only inside this dedicated test repository.');
  process.exit(2);
}

// This deliberately restores only OWNED test files. It never touches .git, docs,
// arbitrary user files, vendor packages, or code in the DevOps platform repo.
const ownedFiles = [
  'package.json', 'package-lock.json', '.npmrc',
  'src/main.ts', 'src/app.cjs', 'tests/test-settings.json',
];
for (const name of ownedFiles) {
  write(name, read(`scenarios/base/${name}`));
}
fs.rmSync(path.join(root, 'Dockerfile'), { force: true });

const pkg = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
let ts = read('src/main.ts');
let testConfig = read('tests/test-settings.json');
let npmrc = read('.npmrc');
let dockerfile = null;

switch (id) {
  case 'baseline':
    break;
  case 'n01-ts2322':
    ts = 'const count: number = "not-a-number";\nconsole.log(count);\n';
    break;
  case 'n02-ts2307':
    ts = 'import { getCount } from "./missing-helper";\nconsole.log(getCount());\n';
    break;
  case 'n03-ts2345':
    ts = 'function double(value: number): number { return value * 2; }\nconsole.log(double("wrong-type"));\n';
    break;
  case 'n04-ts7006':
    ts = 'export function normalize(value) { return String(value).trim(); }\n';
    break;
  case 'n05-npm-integrity':
    // The real local TypeScript tarball stays untouched. Only its lockfile hash
    // is changed, producing a deterministic npm EINTEGRITY failure.
    lock.packages['node_modules/typescript'].integrity = 'sha512-' + 'A'.repeat(86) + '==';
    break;
  case 'n06-npm-missing-tarball':
    pkg.dependencies = { 'scenario-missing-artifact': 'file:vendor/not-here-1.0.0.tgz' };
    lock.packages[''].dependencies = { ...pkg.dependencies };
    lock.packages['node_modules/scenario-missing-artifact'] = {
      version: '1.0.0', resolved: 'file:vendor/not-here-1.0.0.tgz',
    };
    break;
  case 'n07-runtime-engine':
    // Keep root engines compatible with Node 20 so repository/runtime preflight passes.
    // A specific build tool intentionally requires Node 22+, causing a REAL runner build failure.
    pkg.scripts.build = 'node tools/check-node-runtime.cjs && node tools/build.cjs';
    break;
  case 'n08-build-missing-tsconfig':
    pkg.scripts.build = 'node tools/build.cjs --tsconfig tsconfig.missing.json';
    break;
  case 'n09-build-missing-script':
    pkg.scripts.build = 'npm run build:release';
    break;
  case 'n10-test-invalid-json':
    testConfig = '{ "runner": "node:test", "include": [ }\n';
    break;
  case 'n11-test-missing-file':
    testConfig = JSON.stringify({ runner: 'node:test', include: ['tests/does-not-exist.test.cjs'] }, null, 2) + '\n';
    break;
  case 'n12-registry-connection-refused':
    pkg.dependencies = { 'scenario-network-artifact': '1.0.0' };
    lock.packages[''].dependencies = { ...pkg.dependencies };
    lock.packages['node_modules/scenario-network-artifact'] = {
      version: '1.0.0',
      resolved: 'http://127.0.0.1:9/scenario-network-artifact-1.0.0.tgz',
    };
    npmrc = npmrc.replace('offline=true', 'offline=false') + 'fetch-timeout=10000\n';
    break;
  case 'n13-docker-missing-copy':
    dockerfile = 'FROM scratch\nCOPY file-that-does-not-exist.txt /app/missing.txt\n';
    break;
  case 'n14-docker-invalid-directive':
    dockerfile = 'FROM scratch\nTHIS_IS_NOT_A_DOCKERFILE_COMMAND broken\n';
    break;
  case 'n15-ts2588':
    ts = 'const mode = "test";\nmode = "production";\nconsole.log(mode);\n';
    break;
  case 'n16-build-unknown-tsc-flag':
    pkg.scripts.build = 'node node_modules/typescript/bin/tsc --unknownOption';
    break;
  default:
    console.error('Scenario declared in catalog but not implemented:', id);
    process.exit(2);
}

write('package.json', JSON.stringify(pkg, null, 2) + '\n');
write('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
write('.npmrc', npmrc);
write('src/main.ts', ts);
write('tests/test-settings.json', testConfig);
if (dockerfile !== null) write('Dockerfile', dockerfile);
write('experiment.json', JSON.stringify({
  scenario_id: id,
  expected_category: scenario.expected_category === 'BASELINE' ? null : scenario.expected_category,
  expected_stage: scenario.expected_stage,
  provenance: 'CONTROLLED_INDUCED',
  expected_category_is_verified: false,
  note: 'Expected labels are hypotheses. Verify against actual Runner evidence and record commit SHA.',
}, null, 2) + '\n');

console.log(`Activated ${id}`);
console.log(`Expected failure category (UNVERIFIED): ${scenario.expected_category}`);
console.log(`Required pipeline stage: ${scenario.expected_stage}`);
console.log('Next: git add -A && git commit -m "test: ' + id + '" && git push');
console.log('Then re-analyze/compose if required and launch a NEW pipeline run.');
if (id.startsWith('n13-') || id.startsWith('n14-')) {
  console.log('IMPORTANT: Docker Build must be explicitly selected and a Docker builder must be available.');
}
if (id === 'n07-runtime-engine') console.log('IMPORTANT: Select node-20 and include node-build; npm ci succeeds, build requires Node >=22.');
