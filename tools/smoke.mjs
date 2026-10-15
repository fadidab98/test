import {createServer} from 'node:http';
import {once} from 'node:events';
import {createApplication} from '../apps/api/src/composition.mjs';
import {createRouter} from '../apps/api/src/router.mjs';
const server=createServer(createRouter(createApplication({logger:{info(){},warn(){}}})));
server.listen(0,'127.0.0.1');await once(server,'listening');
const base=`http://127.0.0.1:${server.address().port}`;
try{
 const health=await (await fetch(base+'/health/ready')).json();if(health.status!=='READY')throw new Error('Healthcheck failed');
 const auth=await (await fetch(base+'/api/v1/auth/demo',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({role:'operator'})})).json();
 const orderResponse=await fetch(base+'/api/v1/orders',{method:'POST',headers:{authorization:`Bearer ${auth.accessToken}`,'content-type':'application/json'},body:JSON.stringify({customerId:'smoke',lines:[{sku:'LAPTOP-14',quantity:1}]})});
 if(orderResponse.status!==201)throw new Error(`Expected 201, got ${orderResponse.status}`);
 const order=await orderResponse.json();if(order.state!=='CONFIRMED')throw new Error('Workflow not confirmed');
 console.log('SMOKE PASSED: /health/ready, auth, order saga, payment authorization, inventory reservation');
}finally{server.close()}
