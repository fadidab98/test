import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root,'scenarios','catalog.json'),'utf8'));
const name = process.argv[2];
if (!name || ['-h','--help'].includes(name)) {
  console.log('Use: node tools/activate-scenario.mjs --list');
  console.log('     node tools/activate-scenario.mjs <scenario-id>');
  console.log('     node tools/activate-scenario.mjs --reset');
  process.exit(name ? 0 : 2);
}
if (name === '--list') {
  for(const s of catalog) console.log(`${s.id.padEnd(32)} ${s.expected_category.padEnd(35)} ${s.expected_stage}`);
  process.exit(0);
}
const actualName = name === '--reset' ? 'baseline' : name;
const chosen = catalog.find(s => s.id === actualName);
if (!chosen) { console.error('Unknown scenario. See --list'); process.exit(2); }

const pkg = {
  name:'devops-ml-failure-lab', version:'1.0.0', private:true,
  description:'Controlled real CI failure scenarios for moderator-reviewed ML labels',
  scripts:{build:'node tools/build.cjs',test:'node --test tests/app.test.js'},
  engines:{node:'>=18'}
};
const lock = {
  name:pkg.name,version:pkg.version,lockfileVersion:3,requires:true,
  packages:{'':{name:pkg.name,version:pkg.version,engines:{node:'>=18'}}}
};
let npmrc = 'audit=false\nfund=false\n';
let source = "'use strict';\nfunction add(a, b) {\n  return a + b;\n}\nmodule.exports = { add };\n";
let dockerfile = null;
let dropLock = false;

switch (actualName) {
  case 'baseline': break;
  case 'runtime-node24-engine':
    pkg.engines.node = '>=24';
    lock.packages[''].engines.node = '>=24';
    npmrc += 'engine-strict=true\n';
    break;
  case 'runtime-openssl-md4':
    pkg.scripts.build = 'node tools/legacy-openssl.cjs';
    break;
  case 'dependency-no-lockfile':
    dropLock = true;
    break;
  case 'dependency-stale-lockfile':
    pkg.dependencies = {'is-number':'7.0.0'}; // Lockfile intentionally not updated.
    break;
  case 'dependency-missing-module':
    source = "'use strict';\nconst missing = require('missing-ml-lab-dependency');\nmodule.exports = { missing };\n";
    break;
  case 'build-missing-nested-script':
    pkg.scripts.build = 'npm run build:release';
    break;
  case 'build-wrong-entrypoint':
    pkg.scripts.build = 'node src/wrong-entrypoint.js';
    break;
  case 'test-missing-suite':
    pkg.scripts.test = 'node --test tests/nonexistent-test-file.test.js';
    break;
  case 'test-invalid-runner-flag':
    pkg.scripts.test = 'node --not-a-real-test-runner-option --test tests/app.test.js';
    break;
  case 'compilation-syntax-token':
    source = "'use strict';\nconst broken = ;\nmodule.exports = { broken };\n";
    break;
  case 'compilation-unclosed-source':
    source = "'use strict';\nfunction add(a, b) {\n  return a + b;\n// intentional unclosed function\n";
    break;
  case 'network-unreachable-package':
    pkg.dependencies = {'ml-lab-network-artifact':'1.0.0'};
    lock.packages[''].dependencies = { ...pkg.dependencies };
    lock.packages['node_modules/ml-lab-network-artifact'] = {
      version:'1.0.0', resolved:'http://127.0.0.1:9/ml-lab-network-artifact-1.0.0.tgz'
    };
    break;
  case 'container-missing-copy':
    dockerfile = 'FROM scratch\nCOPY intentionally-missing-artifact.bin /app/build-artifact.bin\n';
    break;
  default: throw new Error('Scenario missing implementation: ' + actualName);
}

const write = (file,contents) => fs.writeFileSync(path.join(root,file),contents,'utf8');
write('package.json', JSON.stringify(pkg,null,2)+'\n');
if(dropLock) {
  fs.rmSync(path.join(root,'package-lock.json'),{force:true});
} else {
  write('package-lock.json',JSON.stringify(lock,null,2)+'\n');
}
write('.npmrc',npmrc);
write('src/app.js',source);
if(dockerfile === null) fs.rmSync(path.join(root,'Dockerfile'),{force:true});
else write('Dockerfile',dockerfile);
write('experiment.json',JSON.stringify({
  scenario_id:chosen.id,
  expected_category:chosen.expected_category === 'BASELINE' ? null : chosen.expected_category,
  expected_stage:chosen.expected_stage,
  provenance:'CONTROLLED_INDUCED',
  note:'Expected category is a hypothesis, NOT an independently verified label; review the actual runner evidence.'
},null,2)+'\n');
console.log(`Activated ${chosen.id} (${chosen.expected_category})`);
console.log('Commit + push changed root files, then re-analyze the repository and start a NEW pipeline run.');
console.log(`Expected pipeline stage: ${chosen.expected_stage}`);
if(actualName==='container-missing-copy') console.log('Remember to enable/select the optional Docker Build step.');
if(actualName==='runtime-node24-engine') console.log('Runtime preflight may block before Runner; check selected execution environment.');
