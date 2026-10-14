export function assertEvent(event){if(!event?.id||!event?.kind)throw new Error('Missing event identity');return event;}
export function canonicalEvent(event){return {...assertEvent(event),kind:event.kind.toUpperCase()};}
