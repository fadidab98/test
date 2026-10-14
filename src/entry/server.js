import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {healthReport} from '../monitoring/health.js';
import {verifyRuntimePolicy} from '../runtime/compatibility.js';
verifyRuntimePolicy();
const config=JSON.parse(readFileSync(new URL('../../config/service.config.json',import.meta.url),'utf8'));
createServer((_req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(healthReport(config)));}).listen(8097);
