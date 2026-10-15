import {readFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
const ROOT=process.cwd();
export async function tryServeStatic(request,response){
  if(request.method!=='GET'&&request.method!=='HEAD')return false;
  const path=new URL(request.url,'http://localhost').pathname;
  const files={'/':'index.html','/index.html':'index.html','/main.js':'main.js','/styles.css':'styles.css'};
  const filename=files[path];if(!filename)return false;
  const base=resolve(ROOT,process.env.AEGIS_WEB_DIR||'dist/dashboard');
  for(const folder of [base,resolve(ROOT,'apps/dashboard/src')]){
    const target=resolve(folder,filename);
    if(!target.startsWith(folder+sep))continue;
    try{const data=await readFile(target);response.writeHead(200,{'content-type':filename.endsWith('.html')?'text/html; charset=utf-8':filename.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','cache-control':'no-cache'});response.end(request.method==='HEAD'?undefined:data);return true}catch(error){if(error.code!=='ENOENT')throw error}
  }
  response.writeHead(404);response.end('Not found');return true;
}
