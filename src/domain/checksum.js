import { createHash } from 'node:crypto';
export function checksum(payload) { return createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 12); }
