import {domainError} from '@aegis/contracts';
export class InMemoryMessageBus {
  #handlers=new Map();#seen=new Set();#deadLetters=[];
  subscribe(type,handler){const list=this.#handlers.get(type)||[];list.push(handler);this.#handlers.set(type,list);return ()=>this.#handlers.set(type,list.filter(h=>h!==handler))}
  async publish(event,{retries=2}={}){
    if(this.#seen.has(event.id))return {duplicate:true,delivered:0};
    const handlers=[...(this.#handlers.get(event.type)||[]),...(this.#handlers.get('*')||[])];
    let delivered=0;
    for(const handler of handlers){let attempt=0;let error;
      do{attempt++;try{await handler(structuredClone(event));delivered++;error=null;break}catch(cause){error=cause}}while(attempt<=retries);
      if(error){this.#deadLetters.push({event:structuredClone(event),attempt,error:String(error.message||error)});throw domainError('DELIVERY_FAILED',`Handler for ${event.type} failed after ${attempt} attempts`)}
    }
    this.#seen.add(event.id);return {duplicate:false,delivered};
  }
  deadLetters(){return structuredClone(this.#deadLetters)}
  deliveredCount(){return this.#seen.size}
}
