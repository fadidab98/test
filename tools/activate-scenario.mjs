#!/usr/bin/env node
'use strict';
// Switch between the passing baseline and a controlled Maven Surefire launch failure.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'scenarios', 'base', 'pom.xml');
const dest = path.join(root, 'pom.xml');
const scenario = process.argv[2];
if (!scenario || !['--reset','tc01-surefire-invalid-java-path'].includes(scenario)) {
  console.error('Usage: node tools/activate-scenario.mjs --reset | tc01-surefire-invalid-java-path');
  process.exit(2);
}
const baseline = fs.readFileSync(source, 'utf8');
if (scenario === '--reset') {
  fs.writeFileSync(dest, baseline);
  console.log('Activated passing Spring Boot baseline');
  process.exit(0);
}
const needle = '<artifactId>maven-surefire-plugin</artifactId><version>3.2.5</version>';
if (!baseline.includes(needle)) {
  console.error('Cannot find expected Surefire plugin; no files changed.');
  process.exit(1);
}
const replacement = needle + `<configuration>
      <forkCount>1</forkCount>
      <reuseForks>false</reuseForks>
      <jvm>\${project.basedir}/tools/missing-test-jdk/bin/java</jvm>
    </configuration>`;
fs.writeFileSync(dest, baseline.replace(needle, replacement));
console.log('Activated tc01-surefire-invalid-java-path');
console.log('Maven compilation should succeed, then Surefire should fail launching its test JVM.');
