import {test} from 'node:test';import assert from 'node:assert/strict';
import {createServer} from 'node:http';import {once} from 'node:events';
import {createApplication} from '../apps/api/src/composition.mjs';import {createRouter} from '../apps/api/src/router.mjs';
async function fixture(){const app=createApplication({logger:{info(){},warn(){}}});const server=createServer(createRouter(app));server.listen(0,'127.0.0.1');await once(server,'listening');
 const base=`http://127.0.0.1:${server.address().port}`;return {app,base,close:()=>new Promise(resolve=>server.close(resolve))}}
async function auth(base,role='operator'){const r=await fetch(base+'/api/v1/auth/demo',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({role})});const x=await r.json();return {authorization:`Bearer ${x.accessToken}`}}
async function run(t,check){const f=await fixture();t.after(f.close);return check(f)}
test('Readiness returns READY',t=>run(t,async({base})=>{const r=await fetch(base+'/health/ready');assert.equal(r.status,200);assert.equal((await r.json()).status,'READY')}));
test('Liveness returns UP',t=>run(t,async({base})=>assert.equal((await(await fetch(base+'/health/live')).json()).status,'UP')));
test('Public OpenAPI discovery works',t=>run(t,async({base})=>assert.equal((await fetch(base+'/api/v1/openapi')).status,200)));
test('Private routes reject missing auth',t=>run(t,async({base})=>assert.equal((await fetch(base+'/api/v1/orders')).status,401)));
test('Viewer cannot create orders',t=>run(t,async({base})=>assert.equal((await fetch(base+'/api/v1/orders',{method:'POST',headers:{...await auth(base,'viewer'),'content-type':'application/json'},body:JSON.stringify({customerId:'c',lines:[{sku:'LAPTOP-14',quantity:1}]})})).status,403)));
test('Inventory endpoint returns catalog',t=>run(t,async({base})=>{const r=await fetch(base+'/api/v1/inventory',{headers:await auth(base)});assert.equal((await r.json()).items.length,5)}));
test('Create order returns 201',t=>run(t,async({base})=>{const r=await fetch(base+'/api/v1/orders',{method:'POST',headers:{...await auth(base),'content-type':'application/json'},body:JSON.stringify({customerId:'c',lines:[{sku:'LAPTOP-14',quantity:1}]})});assert.equal(r.status,201);assert.equal((await r.json()).state,'CONFIRMED')}));
test('Invalid JSON returns 400',t=>run(t,async({base})=>{const r=await fetch(base+'/api/v1/orders',{method:'POST',headers:{...await auth(base),'content-type':'application/json'},body:'{oops'});assert.equal(r.status,400)}));
test('Unpriced SKU returns structured error',t=>run(t,async({base})=>{const r=await fetch(base+'/api/v1/orders',{method:'POST',headers:{...await auth(base),'content-type':'application/json'},body:JSON.stringify({customerId:'c',lines:[{sku:'MISSING',quantity:1}]})});assert.equal((await r.json()).error.code,'UNKNOWN_SKU')}));
test('Unknown endpoint returns 404',t=>run(t,async({base})=>assert.equal((await fetch(base+'/api/v1/nonexistent',{headers:await auth(base)})).status,404)));
test('Outbox can flush into journal',t=>run(t,async({base})=>{const headers={...await auth(base),'content-type':'application/json'};await fetch(base+'/api/v1/orders',{method:'POST',headers,body:JSON.stringify({customerId:'c',lines:[{sku:'LAPTOP-14',quantity:1}]})});const flush=await fetch(base+'/api/v1/outbox/flush',{method:'POST',headers});assert.equal((await flush.json()).delivered,1);const events=await(await fetch(base+'/api/v1/events',{headers})).json();assert.equal(events.integrity,true);assert.equal(events.events.length,1)}));
test('Analytics includes workflow counters',t=>run(t,async({base})=>{const r=await fetch(base+'/api/v1/analytics',{headers:await auth(base)});assert.equal((await r.json()).orders.orders,0)}));
