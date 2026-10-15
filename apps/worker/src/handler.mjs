import {domainError,EVENT_TYPES} from '@aegis/contracts';
export class NotificationWorker {
  #sent=[];#processed=new Set();
  constructor({transport=async()=>true,logger}={}){this.transport=transport;this.logger=logger}
  async process(event){
    if(this.#processed.has(event.id))return {duplicate:true};
    if(event.type!==EVENT_TYPES.CONFIRMED)return {ignored:true};
    if(!event.payload.orderId)throw domainError('INVALID_EVENT','Confirmed order event requires orderId');
    await this.transport({recipient:`orders+${event.tenantId}@example.invalid`,template:'order-confirmed',orderId:event.payload.orderId});
    this.#sent.push(event.id);this.#processed.add(event.id);this.logger?.info('notification.sent',{eventId:event.id});
    return {sent:true};
  }
  sentCount(){return this.#sent.length}
}
