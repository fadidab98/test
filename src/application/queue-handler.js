import {uniqueEvents} from './dedupe.js';
import {processEvents} from './process-events.js';
export async function handleDelivery(events,store){const processed=processEvents(uniqueEvents(events));await store.save(processed);return processed;}
