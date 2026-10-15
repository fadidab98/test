export class TtlCache {
  #values=new Map();
  constructor({clock=()=>Date.now()}={}){this.clock=clock}
  set(key,value,ttlMs){this.#values.set(key,{value:structuredClone(value),expires:this.clock()+ttlMs})}
  get(key){const record=this.#values.get(key);if(!record)return null;if(record.expires<=this.clock()){this.#values.delete(key);return null}return structuredClone(record.value)}
  invalidate(key){return this.#values.delete(key)}
  clear(){this.#values.clear()}
}
