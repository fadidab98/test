export function aggregateOrders(orders){const byState={};const byTenant={};let totalCents=0;
  for(const order of orders){byState[order.state]=(byState[order.state]||0)+1;byTenant[order.tenantId]=(byTenant[order.tenantId]||0)+1;totalCents+=order.quote?.total?.cents||0}
  return {orders:orders.length,byState,byTenant,grossCents:totalCents};
}
export function detectVolumeAnomaly(samples,{deviationFactor=2.5,minSamples=5}={}){
  if(samples.length<minSamples)return {anomaly:false,reason:'INSUFFICIENT_SAMPLES'};
  const historical=samples.slice(0,-1);const average=historical.reduce((sum,v)=>sum+v,0)/historical.length;
  const latest=samples.at(-1);return {anomaly:latest>Math.max(1,average)*deviationFactor,baseline:average,latest};
}
export function calculateAvailability({successes,failures}){const total=successes+failures;return total?Math.round(successes/total*10000)/100:100}
