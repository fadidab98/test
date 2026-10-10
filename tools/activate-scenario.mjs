#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const choices = new Map([
  ['tc02-maven-unresolved-dependency', {
    category: 'DEPENDENCY_FAILURE',
    error: 'Could not resolve dependencies / Could not find artifact',
  }],
  ['tc03-java-syntax-error', {
    category: 'COMPILATION_FAILURE',
    error: "COMPILATION ERROR / ';' expected",
  }],
  ['tc04-java-version-mismatch', {
    category: 'RUNTIME_MISMATCH',
    error: 'This project requires Java 21 or later (Java 17 runner)',
  }],
  ['tc05-invalid-pom-xml', {
    category: 'BUILD_CONFIGURATION_FAILURE',
    error: 'Non-parseable POM / mismatched XML tag',
  }],
]);
const scenario = process.argv[2];
if (process.argv.length !== 3 || (scenario !== 'reset' && !choices.has(scenario))) {
  console.error('Usage: node tools/activate-scenario.mjs <scenario-id|reset>');
  console.error('Available scenarios:');
  for (const [id, info] of choices) console.error(`  ${id} -> ${info.category}`);
  process.exit(2);
}
const selected = scenario === 'reset' ? 'baseline' : scenario;
const src = join(root, 'tools', 'scenarios', selected);
const targets = [
  ['pom.xml', 'pom.xml'],
  ['Calculator.java', 'src/main/java/dev/cicd/lab/Calculator.java'],
];
for (const [filename, relativeDestination] of targets) {
  const content = readFileSync(join(src, filename), 'utf8');
  writeFileSync(join(root, relativeDestination), content, 'utf8');
}
if (scenario === 'reset') {
  console.log('Baseline restored. Expected: mvn -B test -> BUILD SUCCESS.');
} else {
  const info = choices.get(scenario);
  console.log(`Activated: ${scenario}`);
  console.log(`Expected Category: ${info.category}`);
  console.log(`Expected Error Pattern: ${info.error}`);
}
console.log('Next: git add pom.xml src/main/java/dev/cicd/lab/Calculator.java');
console.log('Then commit and push to GitHub BEFORE starting a new platform pipeline run.');
