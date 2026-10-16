import {spawnSync} from 'node:child_process';
import {currentScenario} from './scenario.mjs';
const scenario=await currentScenario();
console.log(`[test] Aegis test runner / scenario=${scenario} / built-in Node test harness`);
if(scenario==='test-config'){
 console.error('Error [ERR_TEST_CONFIG]: configured test reporter could not be resolved: ./config/reporters/enterprise-ci-reporter.mjs');
 console.error('Check the test runner configuration and reporter module path.');process.exit(1);
}
const files=['tests/domain.test.mjs','tests/security.test.js','tests/persistence.test.js','tests/workflows.test.js','tests/messaging.test.js','tests/analytics.test.js','tests/integration.test.js','tests/worker.test.js','tests/failure-injection.test.js'];
const result=spawnSync(process.execPath,['--test',...files],{stdio:'inherit',env:{...process.env,AEGIS_TEST_SCENARIO:scenario}});
process.exit(result.status??1);
