import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const baseline=JSON.parse(readFileSync('lab/baseline.json'));
const cases=JSON.parse(readFileSync('lab/scenarios.json'));
const id=process.argv[2];
if(id==='list') { for(const c of cases) console.log(c.id+' '+c.title); process.exit(0); }
const c=cases.find(x=>x.id===id);
if(id!=='reset' && !c) { console.error('Use list, reset, or 01..20'); process.exit(2); }
// Only the documented fixture files are reset; never delete the repository.
rmSync('.npmrc',{force:true});
for(const [name,body] of Object.entries({...baseline,...(c?.files||{})})) {
 if(body===null) rmSync(name,{force:true});
 else { mkdirSync(dirname(name),{recursive:true}); writeFileSync(name,body); }
}
console.log(c ? 'Applied '+c.id+': '+c.title : 'Baseline restored');
