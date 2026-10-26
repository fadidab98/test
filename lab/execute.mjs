import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const c=JSON.parse(readFileSync('lab/scenarios.json')).find(c=>c.id===process.argv[2]);
if(!c || c.command.startsWith('docker ')) process.exit(2);
console.log('Executing: '+c.command);
const r=spawnSync('sh',['-c',c.command],{stdio:'inherit',timeout:120000});
if(r.error) console.error(r.error.message);
process.exit(r.status ?? 124);
