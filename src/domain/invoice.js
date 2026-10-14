import {canonicalId} from './normalize.js';
export function normalizeInvoice(item){return {id:canonicalId(item.id),amountCents:Math.round(Number(item.amount)*100)};}
export function validateInvoice(item){if(!item?.id || !(item.amount >= 0))throw new Error('Invalid invoice');return true;}
