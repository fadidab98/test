export class TransactionalOutbox {
  #pending=[];#delivered=new Set();
  enqueue(event){this.#pending.push(structuredClone(event))}
  async drain(bus,{batchSize=100}={}){let count=0;for(const event of [...this.#pending].slice(0,batchSize)){
    if(this.#delivered.has(event.id)){this.#pending.shift();continue}
    await bus.publish(event);this.#delivered.add(event.id);this.#pending.shift();count++;
  }return count}
  pendingCount(){return this.#pending.length}
}
