import {createServer} from 'node:http';
import {transformBatch} from './application/transform.js';
import {dailyReport} from './application/report.js';
createServer((_req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(dailyReport(transformBatch([{id:' A 1 ',amount:2.30}]))));}).listen(8091);
