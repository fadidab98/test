import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const local = name => path.join(root, name);
const read = name => fs.readFileSync(local(name), 'utf8');
const write = (name, value) => {fs.mkdirSync(path.dirname(local(name)),{recursive:true});fs.writeFileSync(local(name),value,'utf8');};
const catalog = JSON.parse(read('scenarios/catalog.json'));
const arg = process.argv[2];
if (arg === '--list') {
 for (const x of catalog) console.log(x.id.padEnd(39), x.expected_category.padEnd(35), x.expected_stage);
 process.exit(0);
}
if (arg === '--status') { console.log(read('experiment.json')); process.exit(0); }
if (!arg || arg === '--help' || arg === '-h') {
 console.log('Usage: node tools/activate-scenario.mjs (--list|--status|--reset|<scenario-id>)');
 process.exit(arg ? 0 : 2);
}
const id = arg === '--reset' ? 'baseline' : arg;
const scenario = catalog.find(x => x.id === id);
if (!scenario) { console.error(`Unknown scenario: ${id}. Run --list`); process.exit(2); }
if (!fs.existsSync(local('.lab-root')) || read('.lab-root').trim() !== 'REACT_FAILURE_LAB_ONLY') {
 console.error('Not in the dedicated React test repository. No changes made.'); process.exit(2);
}
// Each scenario resets only lab-owned files; unrelated files, .git, and dependencies are untouched.
const owned = ['package.json','package-lock.json','.npmrc','src/App.tsx',
 'tests/test-settings.json','index.html','vite.config.mjs'];
for (const name of owned) write(name, read(`scenarios/base/${name}`));
fs.rmSync(local('Dockerfile'),{force:true});
const pkg = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
let app = read('src/App.tsx');
let index = read('index.html');
let testConfig = read('tests/test-settings.json');
let npmrc = read('.npmrc');
let viteConfig = read('vite.config.mjs');
let dockerfile = null;
const setSource = body => { app = body + '\n'; };
switch (id) {
 case 'baseline': break;
 case 'r01-ts2322-react-props':
   setSource('import React from "react";\nexport function App() { const attempts: number = "two"; return <main>{attempts}</main>; }'); break;
 case 'r02-ts2307-missing-component':
   setSource('import React from "react";\nimport { MissingCard } from "./MissingCard";\nexport function App() { return <main><MissingCard /></main>; }'); break;
 case 'r03-ts2345-invalid-argument':
   setSource('import React from "react";\nfunction formatCount(value: number) { return value.toFixed(0); }\nexport function App() { return <main>{formatCount("five")}</main>; }'); break;
 case 'r04-ts7006-implicit-any':
   setSource('import React from "react";\nfunction describeFailure(value) { return String(value); }\nexport function App() { return <main>{describeFailure(1)}</main>; }'); break;
 case 'r05-ts2588-const-assignment':
   setSource('import React from "react";\nexport function App() { const category = "BUILD"; category = "TEST"; return <main>{category}</main>; }'); break;
 case 'r06-vite-missing-entry':
   index = index.replace('/src/main.tsx','/src/entry-does-not-exist.tsx'); break;
 case 'r07-build-missing-tsconfig':
   pkg.scripts.build = 'node tools/build.cjs --tsconfig tsconfig.missing.json'; break;
 case 'r08-build-missing-script':
   pkg.scripts.build = 'npm run build:release'; break;
 case 'r09-test-invalid-json':
   testConfig = '{ "runner": "node:test", "include": [ }\n'; break;
 case 'r10-test-missing-file':
   testConfig = JSON.stringify({runner:'node:test',include:['tests/MissingCard.test.js']},null,2)+'\n'; break;
 case 'r11-npm-missing-artifact':
   pkg.dependencies['react-missing-local-archive'] = 'file:vendor/react-missing-archive.tgz';
   lock.packages[''].dependencies = { ...pkg.dependencies };
   lock.packages['node_modules/react-missing-local-archive'] = {
      version:'1.0.0',resolved:'file:vendor/react-missing-archive.tgz'
   }; break;
 case 'r12-npm-integrity':
   lock.packages['node_modules/react'].integrity = 'sha512-'+ 'A'.repeat(86) +'=='; break;
 case 'r13-registry-refused':
   pkg.dependencies['react-registry-failure-lab'] = '1.0.0';
   lock.packages[''].dependencies = { ...pkg.dependencies };
   lock.packages['node_modules/react-registry-failure-lab'] = {
      version:'1.0.0',resolved:'http://127.0.0.1:9/react-registry-failure-lab-1.0.0.tgz'
   }; npmrc+='fetch-retries=0\nfetch-timeout=10000\n'; break;
 case 'r14-docker-missing-copy':
   dockerfile = 'FROM scratch\nCOPY react-dist-does-not-exist/ /usr/share/nginx/html/\n'; break;
 case 'r15-docker-invalid-command':
   dockerfile = 'FROM scratch\nTHIS_IS_NOT_VALID_DOCKER_INSTRUCTION broken\n'; break;
 case 'r16-build-tool-node22':
   pkg.scripts.build = 'node tools/check-node-runtime.cjs && node tools/build.cjs'; break;
 case 'r17-test-unsupported-runner':
   testConfig = JSON.stringify({runner:'jest',include:['tests/GreetingCard.test.js']},null,2)+'\n'; break;
 case 'r18-vite-broken-config-import':
   viteConfig = "import { defineConfig } from 'vite';\nimport missingPlugin from './missing-vite-plugin.mjs';\nexport default defineConfig({plugins:[missingPlugin()]});\n"; break;
 default: console.error('Unimplemented scenario '+id); process.exit(2);
}
write('package.json',JSON.stringify(pkg,null,2)+'\n');
write('package-lock.json',JSON.stringify(lock,null,2)+'\n');
write('src/App.tsx',app);
write('index.html',index);
write('tests/test-settings.json',testConfig);
write('.npmrc',npmrc);
write('vite.config.mjs',viteConfig);
if (dockerfile !== null) write('Dockerfile',dockerfile);
write('experiment.json',JSON.stringify({scenario_id:id,expected_category:id==='baseline'?null:scenario.expected_category,
 expected_stage:scenario.expected_stage,provenance:'CONTROLLED_INDUCED',expected_category_is_verified:false,
 note:'This metadata is not automatically persisted in the platform dataset; review actual Runner evidence.'},null,2)+'\n');
console.log(`Activated ${id}`);
console.log(`Expected (not verified): ${scenario.expected_category}`);
console.log(`Required stage: ${scenario.expected_stage}`);
console.log('Next: git add -A && git commit -m "test: '+id+'" && git push');
console.log('Then re-analyze/re-compose a new plan if needed and execute a NEW pipeline.');
if (id.startsWith('r14-') || id.startsWith('r15-')) console.log('Docker Build stage and builder are REQUIRED for this scenario.');
if (id==='r16-build-tool-node22') console.log('Select Node 20; package engines stays compatible, build-tool check fails inside Runner.');
