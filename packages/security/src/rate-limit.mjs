export class TokenBucket {
  #buckets=new Map();
  constructor({capacity=60,refillPerSecond=1,clock=()=>Date.now()}={}){this.capacity=capacity;this.refillPerSecond=refillPerSecond;this.clock=clock}
  take(key,cost=1){const now=this.clock();const prev=this.#buckets.get(key)||{tokens:this.capacity,time:now};
    const tokens=Math.min(this.capacity,prev.tokens+Math.max(0,now-prev.time)*this.refillPerSecond/1000);
    const accepted=tokens>=cost;this.#buckets.set(key,{tokens:accepted?tokens-cost:tokens,time:now});return {accepted,remaining:Math.floor(accepted?tokens-cost:tokens)};
  }
}
