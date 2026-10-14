import {nonEmpty,positiveInteger} from './validation.js';
export function invoice(raw){return {id:nonEmpty(raw.id,'id'),customer:nonEmpty(raw.customer,'customer'),cents:positiveInteger(raw.cents,'cents')};}
export function taxCents(cents,percent){return Math.round(cents*percent/100)};
