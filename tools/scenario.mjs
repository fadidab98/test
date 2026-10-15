import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const SCENARIOS=['success','build-config','compilation','dependency','test','test-config','runtime'];
export async function currentScenario(){const raw=JSON.parse(await readFile(resolve(root,'config/scenario.json'),'utf8'));return raw.active}
export async function setScenario(name){if(!SCENARIOS.includes(name))throw new Error(`Unknown scenario: ${name}; choose from ${SCENARIOS.join(', ')}`);
 await writeFile(resolve(root,'config/scenario.json'),JSON.stringify({active:name,purpose:'Reproducible CI failure benchmark. Commit this scenario selection before importing the repo.'},null,2)+'\n')}
const running=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(running){const name=process.argv[2];if(!name){console.log(`Active scenario: ${await currentScenario()}
Available: ${SCENARIOS.join(', ')}
Usage: npm run scenario -- <name>`)}else{await setScenario(name);console.log(`Scenario set to ${name}. Commit config/scenario.json before running the remote CI pipeline.`)}}
