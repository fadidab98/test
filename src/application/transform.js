import {normalizeInvoice,validateInvoice} from '../domain/invoice.js';
export function transformBatch(items){return items.map(item=>{validateInvoice(item);return normalizeInvoice(item)});}
