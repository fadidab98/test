import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const scenario=process.argv[2];
if (!['baseline','fault','repair'].includes(scenario)) throw new Error('Invalid scenario');
const npm=process.platform==='win32'?'npm.cmd':'npm';
const steps=[['install',npm,['ci','--no-audit','--no-fund']],['test',npm,['test']],['build',npm,['run','build']]];
const results=[];
for (const [name,cmd,args] of steps) {
  const run=spawnSync(cmd,args,{encoding:'utf8',timeout:120000});
  const output=(run.stdout||'')+(run.stderr||'');
  process.stdout.write(output);
  const exit=run.status ?? 125;
  results.push({step:name,exit_code:exit,output,error:run.error?.message||null});
  if (exit!==0) break;
}
const expectedFailure=scenario==='fault';
const passed=expectedFailure ? results.length===1 && results[0].exit_code!==0 && results[0].output.includes('npm error code EUSAGE') && results[0].output.includes("npm error Invalid: lock file's is-number@6.0.0 does not satisfy is-number@7.0.0") : results.length===3 && results.every(item => item.exit_code===0);
mkdirSync('results',{recursive:true});
writeFileSync(`results/${scenario}.json`,JSON.stringify({scenario,expectation_met:passed,node:process.version,build_command:JSON.parse(readFileSync('package.json')).scripts.build,steps:results},null,2));
console.log(`Expected outcome: ${passed?'CONFIRMED':'NOT CONFIRMED'}. Report: results/${scenario}.json`);
process.exit(passed?0:1);
