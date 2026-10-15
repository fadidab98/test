import {ORDER_STATES,domainError} from '@aegis/contracts';
const ALLOWED={DRAFT:['VALIDATED','FAILED'],VALIDATED:['RESERVED','FAILED'],RESERVED:['PAYMENT_AUTHORIZED','CANCELLED','FAILED'],PAYMENT_AUTHORIZED:['CONFIRMED','FAILED'],CONFIRMED:['FULFILLED','CANCELLED'],FULFILLED:[],CANCELLED:[],FAILED:[]};
export class OrderAggregate {
  constructor({id,tenantId='tenant-demo',customerId,lines}){
    this.id=id;this.tenantId=tenantId;this.customerId=customerId;this.lines=structuredClone(lines);
    this.state='DRAFT';this.version=0;this.history=[];this.createdAt=new Date().toISOString();
  }
  transition(target,metadata={}){
    if(!ORDER_STATES.includes(target))throw domainError('INVALID_STATE',`Unknown order state ${target}`);
    if(!ALLOWED[this.state].includes(target))throw domainError('INVALID_TRANSITION',`Cannot move from ${this.state} to ${target}`);
    const from=this.state;this.state=target;this.version++;
    this.history.push({from,to:target,metadata,at:new Date().toISOString()});return this;
  }
  toJSON(){return {id:this.id,tenantId:this.tenantId,customerId:this.customerId,lines:this.lines,state:this.state,version:this.version,history:this.history,createdAt:this.createdAt}}
}
