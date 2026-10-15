const API=localStorage.getItem('aegisApiUrl')||window.location.origin;
let bearer='';
const byId=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const money=cents=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
async function request(path,options={}){
  const headers={'content-type':'application/json',...(bearer?{authorization:`Bearer ${bearer}`}:{}) ,...(options.headers||{})};
  const response=await fetch(`${API}${path}`,{...options,headers});
  const body=await response.json();if(!response.ok)throw new Error(body.error?.message||`HTTP ${response.status}`);return body;
}
async function signIn(){const {accessToken}=await request('/api/v1/auth/demo',{method:'POST',body:JSON.stringify({role:'operator'})});bearer=accessToken}
async function render(){try{
  if(!bearer)await signIn();
  const [inventory,orders,analytics,events]=await Promise.all([
    request('/api/v1/inventory'),request('/api/v1/orders?pageSize=20'),request('/api/v1/analytics'),request('/api/v1/events')]);
  byId('metric-orders').textContent=analytics.orders.orders;
  byId('metric-revenue').textContent=money(analytics.orders.grossCents);
  byId('metric-slo').textContent=`${analytics.availabilityPercent}%`;
  byId('metric-events').textContent=events.events.length;
  byId('inventory-body').innerHTML=inventory.items.map(x=>`<tr><td>${esc(x.sku)}</td><td>${x.quantity}</td><td><span class="tag ${x.quantity<10?'tag-low':''}">${x.quantity<10?'LOW STOCK':'IN STOCK'}</span></td></tr>`).join('');
  byId('orders-body').innerHTML=orders.items.length?orders.items.map(x=>`<tr><td>${esc(x.id.slice(0,12))}...</td><td>${esc(x.customerId)}</td><td><span class="tag">${esc(x.state)}</span></td><td>${money(x.quote.total.cents)}</td></tr>`).join(''):'<tr><td colspan="4">No orders yet — try creating one.</td></tr>';
  byId('events-body').innerHTML=events.events.length?events.events.map(x=>`<div class="event"><span>${esc(x.event.type)}</span><span>${esc(x.event.id.slice(0,16))}</span></div>`).join(''):'<div class="event">No events yet. Create an order and flush the outbox.</div>';
  byId('integrity').textContent=events.integrity?'✓ JOURNAL VERIFIED':'✕ INTEGRITY FAILED';byId('error').classList.add('hidden');
}catch(error){byId('error').textContent=`Dashboard API error: ${error.message}`;byId('error').classList.remove('hidden')}}
byId('refresh').addEventListener('click',render);
byId('order-form').addEventListener('submit',async event=>{event.preventDefault();try{
  const result=await request('/api/v1/orders',{method:'POST',headers:{'idempotency-key':crypto.randomUUID()},body:JSON.stringify({customerId:'customer-demo',lines:[{sku:byId('sku').value,quantity:Number(byId('qty').value)}]})});
  byId('submit-result').textContent=`Order ${result.id.slice(0,10)} confirmed. Total ${money(result.quote.total.cents)}`;await render();
}catch(error){byId('submit-result').textContent=error.message}});
byId('flush').addEventListener('click',async()=>{try{await request('/api/v1/outbox/flush',{method:'POST'});await render()}catch(error){byId('submit-result').textContent=error.message}});
render();
