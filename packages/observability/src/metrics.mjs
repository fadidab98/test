export class MetricsRegistry {
  #counters=new Map();#observations=new Map();
  increment(metric,delta=1){this.#counters.set(metric,(this.#counters.get(metric)||0)+delta)}
  observe(metric,value){const list=this.#observations.get(metric)||[];list.push(value);this.#observations.set(metric,list)}
  snapshot(){return {counters:Object.fromEntries(this.#counters),histograms:Object.fromEntries([...this.#observations].map(([name,values])=>[name,{count:values.length,p50:percentile(values,0.5),p95:percentile(values,0.95)}]))}}
}
export function percentile(values,q){if(!values.length)return 0;const sorted=[...values].sort((a,b)=>a-b);return sorted[Math.min(sorted.length-1,Math.ceil(q*sorted.length)-1)]}
