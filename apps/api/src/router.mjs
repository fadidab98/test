import {randomUUID} from 'node:crypto';
import {domainError,pageResult} from '@aegis/contracts';
import {aggregateOrders,calculateAvailability} from '@aegis/analytics';
import {issueToken,verifyToken,authorize,TokenBucket} from '@aegis/security';
import {createTraceparent} from '@aegis/observability';
const LIMIT=1024*256;
async function readJson(request){
  let bytes=0;const chunks=[];
  for await(const chunk of request){bytes+=chunk.length;if(bytes>LIMIT)throw domainError('PAYLOAD_TOO_LARGE','JSON request exceeded 256 KB');chunks.push(chunk)}
  try{return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}')}catch{throw domainError('INVALID_JSON','Malformed JSON request')}
}
function respond(response,status,body,{correlationId}={}){const payload=JSON.stringify(body);
  response.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-correlation-id':correlationId||''});response.end(payload)}
function statusFor(error){return ({UNAUTHORIZED:401,TOKEN_EXPIRED:401,FORBIDDEN:403,NOT_FOUND:404,OUT_OF_STOCK:409,DUPLICATE_KEY:409,OPTIMISTIC_LOCK:409,PAYMENT_DECLINED:402,PAYLOAD_TOO_LARGE:413,TOO_MANY_REQUESTS:429})[error.code]|| (error.code?400:500)}
export function createRouter(app,{secret=process.env.AEGIS_AUTH_SECRET||'local-only-dev-secret',tenant='tenant-demo',clock=()=>Date.now()}={}){
  const limiter=new TokenBucket({capacity:120,refillPerSecond:2,clock});
  return async function route(request,response){const started=clock();const correlationId=request.headers['x-correlation-id']||randomUUID();
    const url=new URL(request.url,'http://localhost');const path=url.pathname;const method=request.method;
    response.setHeader('x-traceparent',createTraceparent());
    response.setHeader('access-control-allow-origin','*');
    response.setHeader('access-control-allow-headers','authorization,content-type,x-correlation-id,idempotency-key');
    response.setHeader('access-control-allow-methods','GET,POST,OPTIONS');
    if(method==='OPTIONS'){response.writeHead(204);response.end();return}
    try{
      const limit=limiter.take(request.socket?.remoteAddress||'local');
      if(!limit.accepted)throw domainError('TOO_MANY_REQUESTS','Rate limit exceeded');
      if(path==='/health/live')return respond(response,200,{status:'UP',service:'aegis-api'},{correlationId});
      if(path==='/health/ready')return respond(response,200,{status:'READY',subsystems:{database:'IN_MEMORY',bus:'READY',outbox:'READY'}},{correlationId});
      if(path==='/api/v1/auth/demo'&&method==='POST'){
        const body=await readJson(request);const role=['viewer','operator','admin'].includes(body.role)?body.role:'operator';
        return respond(response,200,{accessToken:issueToken({sub:'demo-user',role,tenantId:tenant},secret),expiresIn:3600},{correlationId});
      }
      if(path==='/api/v1/openapi'&&method==='GET')return respond(response,200,{version:'1.0',routes:['/health/live','/health/ready','/api/v1/auth/demo','/api/v1/inventory','/api/v1/orders','/api/v1/analytics','/api/v1/outbox/flush','/api/v1/events']},{correlationId});
      const header=request.headers.authorization||'';
      if(!header.startsWith('Bearer '))throw domainError('UNAUTHORIZED','Bearer token required');
      const principal=verifyToken(header.slice(7),secret,{now:clock()});
      const tenantId=principal.tenantId;
      if(path==='/api/v1/inventory'&&method==='GET'){
        authorize(principal,'inventory:read',tenantId);
        return respond(response,200,{items:app.inventory.snapshot()},{correlationId});
      }
      if(path==='/api/v1/orders'&&method==='GET'){
        authorize(principal,'orders:read',tenantId);
        return respond(response,200,pageResult(app.orders.all(o=>o.tenantId===tenantId),{page:url.searchParams.get('page'),pageSize:url.searchParams.get('pageSize')}),{correlationId});
      }
      if(path==='/api/v1/orders'&&method==='POST'){
        authorize(principal,'orders:write',tenantId);
        const body=await readJson(request);
        const result=await app.workflow.submit(body,{tenantId,idempotencyKey:request.headers['idempotency-key']||randomUUID(),paymentMode:body.paymentMode});
        return respond(response,201,result,{correlationId});
      }
      if(path==='/api/v1/analytics'&&method==='GET'){
        authorize(principal,'analytics:read',tenantId);
        const snapshot=app.metrics.snapshot();const successful=snapshot.counters.orders_confirmed_total||0;const failed=snapshot.counters.orders_failed_total||0;
        return respond(response,200,{orders:aggregateOrders(app.orders.all(o=>o.tenantId===tenantId)),metrics:snapshot,availabilityPercent:calculateAvailability({successes:successful,failures:failed})},{correlationId});
      }
      if(path==='/api/v1/events'&&method==='GET'){
        authorize(principal,'analytics:read',tenantId);
        return respond(response,200,{events:app.journal.readSince(Number(url.searchParams.get('cursor')||0),50).filter(e=>e.event.tenantId===tenantId),integrity:app.journal.verify()},{correlationId});
      }
      if(path==='/api/v1/outbox/flush'&&method==='POST'){
        authorize(principal,'orders:write',tenantId);const delivered=await app.outbox.drain(app.bus);
        return respond(response,200,{delivered,pending:app.outbox.pendingCount()},{correlationId});
      }
      throw domainError('NOT_FOUND',`No route for ${method} ${path}`);
    }catch(error){
      app.logger?.warn('request.failed',{path,method,errorCode:error.code||'UNEXPECTED',correlationId});
      return respond(response,statusFor(error),{error:{code:error.code||'INTERNAL_ERROR',message:error.code?error.message:'Unexpected server error'},correlationId},{correlationId});
    }finally{app.metrics.observe('http_duration_ms',Math.max(0,clock()-started));app.metrics.increment('http_requests_total')}
  }
}
