const { add } = require('./math.cjs');
const fs = require('node:fs');
require('node:child_process').execFileSync(process.execPath, ['scripts/format.mjs'], {stdio: 'inherit'});
const config = JSON.parse(fs.readFileSync('build-config.json', 'utf8'));
fs.mkdirSync(config.target, {recursive: true});
fs.writeFileSync(config.target + '/value.txt', String(add(2, 3)));
