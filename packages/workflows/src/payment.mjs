import {domainError} from '@aegis/contracts';
export class SimulatedPaymentGateway {
  #authorizations=new Map();
  authorize({orderId,amountCents,mode='approve'}){
    if(mode==='decline')throw domainError('PAYMENT_DECLINED',`Issuer declined authorization for order ${orderId}`);
    if(amountCents<=0)throw domainError('INVALID_PAYMENT','Amount must be greater than zero');
    if(this.#authorizations.has(orderId))return this.#authorizations.get(orderId);
    const authorization={authorizationId:`auth-${orderId}`,orderId,amountCents,status:'AUTHORIZED'};
    this.#authorizations.set(orderId,authorization);return {...authorization};
  }
  void(orderId){const authorization=this.#authorizations.get(orderId);if(!authorization)return false;authorization.status='VOIDED';return true}
  get(orderId){return this.#authorizations.get(orderId)||null}
}
