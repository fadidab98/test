import {createServer} from 'node:http';
export async function startRegistry() {
  const requests=[];
  const server=createServer((req,res)=>{
    requests.push(req.url);
    res.setHeader('content-type','application/json');
    if(req.url==='/health'){res.writeHead(200);res.end('{"ok":true}');return;}
    if(req.url==='/v1/metadata'){res.writeHead(200);res.end('{"status":"ready","api":"v1"}');return;}
    if(req.url.startsWith('/v1/artifacts/')){res.writeHead(503,{'retry-after':'30'});res.end('{"error":"registry backend temporarily unavailable"}');return;}
    res.writeHead(404);res.end('{"error":"not found"}');
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const addr=server.address();
  return {baseUrl:`http://127.0.0.1:${addr.port}`,requests,close:()=>new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()))};
}
