import {copyFileSync} from 'node:fs';
const action=process.argv[2];
if(!['baseline','fault','repair'].includes(action)) throw new Error('Use baseline, fault or repair');
copyFileSync(action==='fault'?'lab/out-of-sync-lock.json':'lab/baseline-lock.json','package-lock.json');
console.log(action==='fault'?'Applied lockfile mismatch. Manifest requires 7.0.0, lockfile resolves 6.0.0.':'Baseline lockfile restored.');
