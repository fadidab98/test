import {assertNonEmptyString,assertPositiveInt,domainError} from '@aegis/contracts';
export class InventoryLedger {
  #stock=new Map(); #holds=new Map();
  receive(sku,quantity){assertNonEmptyString(sku,'sku');assertPositiveInt(quantity,'quantity');this.#stock.set(sku,(this.#stock.get(sku)||0)+quantity);return this.available(sku)}
  available(sku){return this.#stock.get(sku)||0}
  reserve(reservationId,lines){
    assertNonEmptyString(reservationId,'reservationId');
    if(this.#holds.has(reservationId))return this.#holds.get(reservationId);
    const demand=new Map();
    for(const {sku,quantity} of lines){assertPositiveInt(quantity,'quantity');demand.set(sku,(demand.get(sku)||0)+quantity)}
    for(const [sku,quantity] of demand)if(this.available(sku)<quantity)throw domainError('OUT_OF_STOCK',`Insufficient stock for ${sku}`,{sku,requested:quantity,available:this.available(sku)});
    for(const [sku,quantity] of demand)this.#stock.set(sku,this.available(sku)-quantity);
    const hold={reservationId,lines:Array.from(demand,([sku,quantity])=>({sku,quantity})),createdAt:new Date().toISOString()};
    this.#holds.set(reservationId,hold);return hold;
  }
  release(reservationId){const hold=this.#holds.get(reservationId);if(!hold)return false;for(const {sku,quantity} of hold.lines)this.#stock.set(sku,this.available(sku)+quantity);this.#holds.delete(reservationId);return true}
  commit(reservationId){return this.#holds.delete(reservationId)}
  snapshot(){return [...this.#stock].map(([sku,quantity])=>({sku,quantity})).sort((a,b)=>a.sku.localeCompare(b.sku))}
  activeReservations(){return this.#holds.size}
}
