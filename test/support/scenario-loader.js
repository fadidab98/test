import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const configFile = resolve(root, 'test/config/test-profile.json');

export async function loadScenarios() {
  const profile = JSON.parse(await readFile(configFile, 'utf8'));
  const expected = resolve(root, profile.fixtureDirectory, profile.fixtureFile);
  let contents;
  try {
    contents = await readFile(expected, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    throw new Error(
      `Cannot initialize test scenarios: ENOENT reading ${expected}; ` +
      `configured fixtureDirectory=${JSON.stringify(profile.fixtureDirectory)} ` +
      `in test/config/test-profile.json`,
      { cause: error },
    );
  }
  const scenarios = JSON.parse(contents).scenarios;
  if (!Array.isArray(scenarios) || scenarios.length !== profile.requiredScenarioCount) {
    throw new Error('Test scenarios do not match the configured profile count');
  }
  return scenarios;
}
