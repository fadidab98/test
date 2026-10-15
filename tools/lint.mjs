import {readdir} from 'node:fs/promises';
import {join,extname} from 'node:path';
import {spawnSync} from 'node:child_process';
const folders=['apps','packages','tools','tests'];let count=0;
async function walk(path){for(const item of await readdir(path,{withFileTypes:true})){
 const full=join(path,item.name);if(item.isDirectory())await walk(full);
 else if(['.js','.mjs'].includes(extname(full))){const result=spawnSync(process.execPath,['--check',full],{stdio:'inherit'});if(result.status)process.exit(result.status);count++}
}}
for(const folder of folders)await walk(folder);
console.log(`Static syntax checks passed for ${count} JavaScript files. (Scenario fixture checked only when activated.)`);
