export const ORDER_STATES = Object.freeze(['DRAFT','VALIDATED','RESERVED','PAYMENT_AUTHORIZED','CONFIRMED','FULFILLED','CANCELLED','FAILED']);
export const EVENT_TYPES = Object.freeze({
  CREATED:'order.created', RESERVED:'inventory.reserved', PAYMENT_AUTHORIZED:'payment.authorized',
  CONFIRMED:'order.confirmed', FULFILLED:'order.fulfilled', COMPENSATED:'order.compensated',
  FAILED:'order.failed', AUDIT:'security.audit'
});
export function domainError(code,message,details={}) {
  const error=new Error(message); error.code=code; error.details=details; return error;
}
export function assertNonEmptyString(v,label) {
  if(typeof v!=='string'||!v.trim())throw domainError('INVALID_ARGUMENT',`${label} must be a non-empty string`);
  return v.trim();
}
export function assertPositiveInt(v,label) {
  if(!Number.isSafeInteger(v)||v<=0)throw domainError('INVALID_ARGUMENT',`${label} must be a positive integer`);
  return v;
}
export function validateOrderRequest(input) {
  if(!input||typeof input!=='object')throw domainError('INVALID_ORDER','Order body must be an object');
  const customerId=assertNonEmptyString(input.customerId,'customerId');
  if(!Array.isArray(input.lines)||input.lines.length===0||input.lines.length>50)throw domainError('INVALID_ORDER','lines must contain between 1 and 50 entries');
  return {customerId,lines:input.lines.map(line=>({sku:assertNonEmptyString(line.sku,'sku'),quantity:assertPositiveInt(line.quantity,'quantity')}))};
}
import crypto from "node:crypto";
export function envelope(type,payload,{tenantId='tenant-demo',correlationId='local',id,occurredAt}={}) {
  assertNonEmptyString(type,'event type');
  return {id:id||crypto.randomUUID(),type,tenantId,correlationId,occurredAt:occurredAt||new Date().toISOString(),payload};
}
export function pageResult(items,{page=1,pageSize=20}={}) {
  const safePage=Math.max(1,Math.floor(Number(page)||1)); const safeSize=Math.min(100,Math.max(1,Math.floor(Number(pageSize)||20)));
  return {items:items.slice((safePage-1)*safeSize,safePage*safeSize),total:items.length,page:safePage,pageSize:safeSize};
}
