import {Money} from './money.mjs';
import {domainError} from '@aegis/contracts';
export class PricingCatalog {
  #prices=new Map();
  set(sku,cents){this.#prices.set(sku,new Money(cents))}
  price(sku){const value=this.#prices.get(sku);if(!value)throw domainError('UNKNOWN_SKU',`SKU ${sku} is not priced`);return value}
  quote(lines,{discountBps=0,taxBps=1900}={}){
    if(!Number.isInteger(discountBps)||discountBps<0||discountBps>5000)throw domainError('INVALID_DISCOUNT','Discount must be 0..5000 bps');
    const subtotal=lines.reduce((sum,line)=>sum.add(this.price(line.sku).multiply(line.quantity)),new Money(0));
    const discount=new Money(Math.round(subtotal.cents*discountBps/10000));
    const taxable=subtotal.subtract(discount);
    const tax=new Money(Math.round(taxable.cents*taxBps/10000));
    return {subtotal,discount,tax,total:taxable.add(tax)};
  }
}
