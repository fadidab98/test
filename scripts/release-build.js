import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
const profilePath='config/release.profile.json';
const profile=JSON.parse(readFileSync(profilePath,'utf8'));
const supported=JSON.parse(readFileSync('config/supported-targets.json','utf8'));
const sources=['src/domain/normalize.js','src/domain/invoice.js','src/application/transform.js',
  'src/application/report.js','src/adapters/memory-store.js','src/adapters/csv.js','src/server.js'];
function step(title, fn){ console.log(`[release] ${title}`);fn();console.log(`[release] PASS ${title}`); }
function configurationError(message){const err=new Error(`Invalid release build target: ${message}`);err.code='BUILD_CONFIG_UNSUPPORTED_MODULE_FORMAT';throw err;}
step('Stage 1/4: syntax checks',()=>{for(const file of sources) execFileSync(process.execPath,['--check',file]);});
step('Stage 2/4: source entry resolution',()=>{if(!existsSync(resolve(profile.entry))) configurationError(`missing entry ${profile.entry}`);});
step('Stage 3/4: release target validation',()=>{
  const actual=profile.target.moduleFormat;
  if (!supported.moduleFormats.includes(actual)) configurationError(
    `config/release.profile.json target.moduleFormat='${actual}' is unsupported; `+
    `supported formats are ${supported.moduleFormats.join(', ')}; runner node target ${profile.target.nodeMajor}`);
});
step('Stage 4/4: manifest generation',()=>{
  mkdirSync(profile.artifactDirectory,{recursive:true});
  writeFileSync(`${profile.artifactDirectory}/manifest.json`,JSON.stringify({entry:profile.entry,target:profile.target},null,2));
});
console.log('[release] Completed');
