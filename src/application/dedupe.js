export function uniqueEvents(events){const seen=new Set();return events.filter(e=>{if(seen.has(e.id))return false;seen.add(e.id);return true;});}
