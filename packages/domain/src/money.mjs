import {domainError} from '@aegis/contracts';
export class Money {
  constructor(cents,currency='EUR') {
    if(!Number.isSafeInteger(cents))throw domainError('INVALID_MONEY','Cents must be an integer');
    if(!/^[A-Z]{3}$/.test(currency))throw domainError('INVALID_CURRENCY','ISO currency required');
    this.cents=cents; this.currency=currency; Object.freeze(this);
  }
  static fromDecimal(value,currency='EUR') {
    if(!Number.isFinite(value))throw domainError('INVALID_MONEY','Finite amount required');
    return new Money(Math.round(value*100),currency);
  }
  add(other){this.#match(other);return new Money(this.cents+other.cents,this.currency)}
  subtract(other){this.#match(other);return new Money(this.cents-other.cents,this.currency)}
  multiply(quantity){if(!Number.isSafeInteger(quantity))throw domainError('INVALID_QUANTITY','Integer required');return new Money(this.cents*quantity,this.currency)}
  #match(other){if(!(other instanceof Money)||this.currency!==other.currency)throw domainError('CURRENCY_MISMATCH','Different currencies cannot be combined')}
  toJSON(){return {amount:(this.cents/100).toFixed(2),currency:this.currency,cents:this.cents}}
}
