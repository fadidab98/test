import {readFileSync,writeFileSync} from 'node:fs';
const action=process.argv[2];
const names={ '01':'Source syntax error', '02':'Invalid dependency name', '03':'Missing test reporter', '04':'Ordinary assertion failure' };
if(action==='list'){for(const [id,name] of Object.entries(names)) console.log(`${id}: ${name}`);process.exit(0);}
if(!['baseline','repair',...Object.keys(names)].includes(action)) throw new Error('Use baseline, repair, list, 01, 02, 03 or 04');
const baseline=JSON.parse(readFileSync('lab/baseline.json','utf8'));
for(const [path,content] of Object.entries(baseline)) writeFileSync(path,content);
const pkg=JSON.parse(baseline['package.json']);
if(action==='01') writeFileSync('src/ledger.js',"const hours=2; const hours=3;\n"+baseline['src/ledger.js']);
if(action==='02') {pkg.dependencies={'invalid package name':'1.0.0'};writeFileSync('package.json',JSON.stringify(pkg,null,2)+'\n');}
if(action==='03') {pkg.scripts.test='node --test --test-reporter=./test/absent-reporter.js test/*.test.js';writeFileSync('package.json',JSON.stringify(pkg,null,2)+'\n');}
if(action==='04') writeFileSync('test/ledger.test.js',baseline['test/ledger.test.js'].replace('},{hours:3}]),5)', '},{hours:3}]),99)'));
console.log(names[action] ? `Applied ${action}: ${names[action]}` : 'Baseline restored.');
