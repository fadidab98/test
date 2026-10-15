import {spawnSync} from 'node:child_process';
import {currentScenario} from './scenario.mjs';
const scenario=await currentScenario();
console.log(`[test] Aegis test runner / scenario=${scenario} / built-in Node test harness`);
if(scenario==='test-config'){
 console.error('Error [ERR_TEST_CONFIG]: configured test reporter could not be resolved: ./config/reporters/enterprise-ci-reporter.mjs');
 console.error('Check the test runner configuration and reporter module path.');process.exit(1);
}
const files=['tests/domain.test.mjs','tests/security.test.mjs','tests/persistence.test.mjs','tests/workflows.test.mjs','tests/messaging.test.mjs','tests/analytics.test.mjs','tests/integration.test.mjs','tests/worker.test.mjs','tests/failure-injection.test.mjs'];
const result=spawnSync(process.execPath,['--test',...files],{stdio:'inherit',env:{...process.env,AEGIS_TEST_SCENARIO:scenario}});
process.exit(result.status??1);
