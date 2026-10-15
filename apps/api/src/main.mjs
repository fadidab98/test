import {createServer} from 'node:http';
import {createApplication} from './composition.mjs';
import {createRouter} from './router.mjs';
import {tryServeStatic} from './static.mjs';
const app=createApplication();const router=createRouter(app);
const port=Number(process.env.PORT||8080);
const server=createServer(async(request,response)=>{
  try{if(await tryServeStatic(request,response))return;await router(request,response)}
  catch(error){app.logger.error('http.internal_error',{message:error.message});if(!response.headersSent)response.writeHead(500);response.end('Internal Server Error')}
});
server.listen(port,'0.0.0.0',()=>app.logger.info('http.started',{port}));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
