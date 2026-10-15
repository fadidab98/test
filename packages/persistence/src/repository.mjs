import {domainError} from '@aegis/contracts';
export class VersionedRepository {
  #rows=new Map();
  constructor({idField='id'}={}){this.idField=idField}
  insert(record){const id=record[this.idField];if(this.#rows.has(id))throw domainError('DUPLICATE_KEY',`Record ${id} already exists`);
    const saved=structuredClone(record);this.#rows.set(id,saved);return structuredClone(saved)}
  get(id){const result=this.#rows.get(id);return result?structuredClone(result):null}
  update(id,expectedVersion,change){const current=this.#rows.get(id);if(!current)throw domainError('NOT_FOUND',`Record ${id} not found`);
    if(current.version!==expectedVersion)throw domainError('OPTIMISTIC_LOCK','Concurrent write detected',{expectedVersion,actualVersion:current.version});
    const next={...structuredClone(current),...structuredClone(change),version:expectedVersion+1};this.#rows.set(id,next);return structuredClone(next)}
  all(predicate=()=>true){return [...this.#rows.values()].filter(predicate).map(row=>structuredClone(row))}
  size(){return this.#rows.size}
}
