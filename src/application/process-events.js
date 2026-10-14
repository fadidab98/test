import {canonicalEvent} from '../domain/event.js';
import {aggregateOrder} from '../domain/order.js';
export function processEvents(events){return aggregateOrder(events.map(canonicalEvent));}
