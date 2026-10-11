import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const project = resolve(here, "..");
const scenarios = {
  "tc06-node-missing-test-dependency": "test-missing-dependency.js.txt",
  "reset": "test-healthy.js.txt",
};
const scenario = process.argv[2];
if (!Object.prototype.hasOwnProperty.call(scenarios, scenario)) {
  console.error("Usage: node tools/activate-scenario.mjs <tc06-node-missing-test-dependency|reset>");
  process.exit(2);
}
copyFileSync(join(here, scenarios[scenario]), join(project, "test", "total.test.js"));
console.log(`Scenario '${scenario}' activated.`);
console.log("Commit and push the changed test file before triggering a fresh pipeline run.");
