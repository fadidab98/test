import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const scenario=process.argv[2];
if(!['baseline','repair','01','02','03','04'].includes(scenario)) throw new Error('Unknown scenario');
const npm=process.platform==='win32'?'npm.cmd':'npm';
const plan=[['install',['ci','--no-audit','--no-fund']],['test',['test']],['build',['run','build']]];
const results=[];
for(const [step,args] of plan){
 const run=spawnSync(npm,args,{encoding:'utf8',timeout:120000});
 const output=(run.stdout||'')+(run.stderr||'');process.stdout.write(output);
 results.push({step,exit_code:run.status??125,output,error:run.error?.message??null});
 if(results.at(-1).exit_code!==0) break;
}
const last=results.at(-1);
const expected={ '01':['test',"Identifier 'hours' has already been declared"], '02':['install','EINVALIDPACKAGENAME'], '03':['test','ERR_MODULE_NOT_FOUND'], '04':['test','ERR_ASSERTION'] }[scenario];
let ok=expected ? last.step===expected[0] && last.exit_code!==0 && last.output.includes(expected[1]) && results.slice(0,-1).every(r=>r.exit_code===0) : results.length===3 && results.every(r=>r.exit_code===0);
if(scenario==='03') ok=ok&&last.output.includes('absent-reporter.js');
if(scenario==='04') ok=ok&&last.output.includes('99');
mkdirSync('results',{recursive:true});
writeFileSync(`results/${scenario}.json`,JSON.stringify({scenario,node:process.version,expected_outcome_confirmed:ok,package_scripts:JSON.parse(readFileSync('package.json')).scripts,steps:results},null,2));
console.log(`Expected outcome: ${ok?'CONFIRMED':'NOT CONFIRMED'}. Report: results/${scenario}.json`);
process.exit(ok?0:1);
