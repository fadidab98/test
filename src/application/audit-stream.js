import { auditEntry,compareSequence } from '../domain/audit-entry.js';
export function appendEvent(store,record) {const entry=auditEntry(record);store.save(entry.id,entry);return entry;}
export function collectEvents(store,ids) {return ids.map(id=>store.get(id)).filter(Boolean).sort(compareSequence);}
