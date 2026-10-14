import { nonEmpty,positiveInteger } from './validation.js';
export function auditEntry(raw) {return {id: nonEmpty(raw.id,'id'), event:nonEmpty(raw.event,'event'), sequence:positiveInteger(raw.sequence,'sequence')};}
export function compareSequence(a,b) {return a.sequence-b.sequence;}
