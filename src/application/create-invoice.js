import {invoice,taxCents} from '../domain/invoice.js';
export function createInvoice(store,raw){const item=invoice(raw);const final={...item,tax:taxCents(item.cents,19)};store.save(item.id,final);return final;}
