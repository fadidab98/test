import {createHash} from 'node:crypto';
export class AppendOnlyJournal {
  #entries=[];
  append(event){const sequence=this.#entries.length+1;const previousHash=this.#entries.at(-1)?.hash||'GENESIS';
    const hash=createHash('sha256').update(JSON.stringify({sequence,previousHash,event})).digest('hex');
    const entry={sequence,previousHash,event:structuredClone(event),hash};this.#entries.push(entry);return structuredClone(entry)}
  readSince(cursor=0,limit=100){return this.#entries.filter(e=>e.sequence>cursor).slice(0,limit).map(e=>structuredClone(e))}
  verify(){let previousHash='GENESIS';for(const entry of this.#entries){const expected=createHash('sha256').update(JSON.stringify({sequence:entry.sequence,previousHash,event:entry.event})).digest('hex');if(entry.hash!==expected)return false;previousHash=entry.hash;}return true}
  get length(){return this.#entries.length}
}
