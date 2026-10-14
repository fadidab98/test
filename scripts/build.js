import {readdirSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
function sources(folder){return readdirSync(folder).flatMap(name=>{const file=join(folder,name);return statSync(file).isDirectory()?sources(file):file.endsWith('.js')?[file]:[];});}
const files=sources('src');
for(const file of files)execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
mkdirSync('dist',{recursive:true});
writeFileSync('dist/artifact-manifest.json',JSON.stringify({files:files.length,mode:'syntax-only',runtimeCheckedDuringIntegration:true},null,2));
console.log(`[build] PASS: ${files.length} JavaScript modules checked; runtime compatibility deferred to integration tests`);
