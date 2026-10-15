import {readFile,readdir,mkdir,copyFile,writeFile,access} from 'node:fs/promises';
import {resolve,relative,join,extname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {currentScenario} from './scenario.mjs';
const root=process.cwd();const scenario=await currentScenario();
const manifest=JSON.parse(await readFile('config/build.pipeline.json','utf8'));
const start=Date.now();
function stage(title){console.log(`[build] ===== ${title} =====`)}
function check(file){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0){process.stderr.write(result.stderr||result.stdout);process.exit(result.status||1)}}
async function walk(folder){const entries=await readdir(folder,{withFileTypes:true});const files=[];for(const e of entries){const loc=join(folder,e.name);
 if(e.isDirectory())files.push(...await walk(loc));else files.push(loc)}return files}
async function exists(path){try{await access(path);return true}catch{return false}}
stage(`Aegis Enterprise Platform / Node ${process.version} / scenario ${scenario}`);
stage('Validate runtime profile');
const major=Number(process.versions.node.split('.')[0]);
if(scenario==='runtime'){
 console.error(`Error [ERR_RUNTIME_VERSION]: This deployment requires Node >=24.0.0, but detected ${process.version} (runner profile node-20).`);
 console.error('The required runtime engine does not match the selected execution environment.');process.exit(1);
}
if(major<manifest.minNodeMajor){console.error(`Unsupported Node runtime ${process.version}; requires >=${manifest.minNodeMajor}`);process.exit(1)}
stage('Validate workspace dependency graph');
const packages=await readdir('packages');const apps=await readdir('apps');
for(const kind of ['packages','apps']){
 for(const name of kind==='packages'?packages:apps){const pkg=JSON.parse(await readFile(`${kind}/${name}/package.json`,'utf8'));
 console.log(`[workspace] ${pkg.name}@${pkg.version} — ${pkg.description}`)
 }
}
stage('Check application and package source syntax');
let checked=0;
for(const folder of ['packages','apps'])for(const file of await walk(folder)){
 if(['.js','.mjs','.cjs'].includes(extname(file))){check(file);checked++}
}
console.log(`[build] Parsed ${checked} JavaScript modules successfully`);
if(scenario==='compilation'){
 stage('Compile generated invoice adapter');
 const fixture='scenarios/fixtures/invalid-invoice-controller.mjs';
 console.log(`[compiler] Checking ${fixture}`);check(fixture);
}
if(scenario==='dependency'){
 stage('Resolve optional payment service dependency');
 console.log('[resolver] Loading production payment connector referenced by the checkout integration');
 await import('@aegis/payment-gateway-adapter-not-installed');
}
stage('Validate build manifest');
let entryFile=manifest.dashboard.entryFile;
if(scenario==='build-config')entryFile='apps/dashboard/src/bootstrap-entry-does-not-exist.js';
if(!await exists(entryFile)){
 console.error(`Error: Invalid build configuration (config/build.pipeline.json)`);
 console.error(`Dashboard entry file '${entryFile}' was not found. Check dashboard.entryFile and the repository checkout.`);
 process.exit(1);
}
for(const entry of [manifest.server.entryFile,manifest.worker.entryFile])if(!await exists(entry)){
 console.error(`Invalid build configuration: missing service entry '${entry}'`);process.exit(1)}
stage('Assemble production dashboard assets');
await mkdir('dist/dashboard',{recursive:true});
for(const file of ['index.html','main.js','styles.css']){
 await copyFile(`apps/dashboard/src/${file}`,`dist/dashboard/${file}`);
 console.log(`[assets] dist/dashboard/${file}`);
}
stage('Generate deterministic deployment manifest');
await writeFile('dist/build-metadata.json',JSON.stringify({application:'aegis-enterprise-cicd-stress-lab',workspaces:packages.length+apps.length,scenario,entries:manifest,buildEpoch:0},null,2));
stage(`SUCCESS: ${checked} modules / ${packages.length+apps.length} workspaces / ${Date.now()-start}ms`);
