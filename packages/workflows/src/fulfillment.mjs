import {randomUUID} from 'node:crypto';
import {EVENT_TYPES,validateOrderRequest,envelope,domainError} from '@aegis/contracts';
import {OrderAggregate,riskScore} from '@aegis/domain';
export class FulfillmentWorkflow {
  #idempotency=new Map();
  constructor({inventory,pricing,payments,orders,outbox,metrics,logger,clock=()=>Date.now()}){
    Object.assign(this,{inventory,pricing,payments,orders,outbox,metrics,logger,clock});
  }
  async submit(raw,{tenantId='tenant-demo',idempotencyKey=randomUUID(),paymentMode='approve'}={}){
    const key=`${tenantId}:${idempotencyKey}`;
    if(this.#idempotency.has(key))return structuredClone(this.#idempotency.get(key));
    const request=validateOrderRequest(raw);
    const id=randomUUID();const order=new OrderAggregate({id,tenantId,...request});
    let reserved=false;
    try{
      order.transition('VALIDATED');
      const quote=this.pricing.quote(request.lines);
      const risk=riskScore({orderTotalCents:quote.total.cents});
      if(risk.decision==='REJECT')throw domainError('RISK_REJECTED','Order rejected by risk policy');
      this.inventory.reserve(id,request.lines);reserved=true;order.transition('RESERVED',{reservationId:id});
      const authorization=this.payments.authorize({orderId:id,amountCents:quote.total.cents,mode:paymentMode});
      order.transition('PAYMENT_AUTHORIZED',{authorizationId:authorization.authorizationId});
      order.transition('CONFIRMED');this.inventory.commit(id);
      const saved={...order.toJSON(),quote:{subtotal:quote.subtotal.toJSON(),discount:quote.discount.toJSON(),tax:quote.tax.toJSON(),total:quote.total.toJSON()}};
      this.orders.insert(saved);
      this.outbox.enqueue(envelope(EVENT_TYPES.CONFIRMED,{orderId:id,totalCents:quote.total.cents},{tenantId,id:`event-${id}`}));
      this.metrics.increment('orders_confirmed_total');this.logger?.info('order.confirmed',{orderId:id,tenantId});
      this.#idempotency.set(key,saved);return structuredClone(saved);
    }catch(error){
      if(reserved)this.inventory.release(id);
      this.payments.void(id);this.metrics.increment('orders_failed_total');
      this.outbox.enqueue(envelope(EVENT_TYPES.FAILED,{orderId:id,code:error.code||'UNEXPECTED'},{tenantId,id:`failed-${id}`}));
      this.logger?.warn('order.compensated',{orderId:id,errorCode:error.code||'UNEXPECTED'});throw error;
    }
  }
}
