import {randomBytes} from 'node:crypto';
export function createTraceparent(){return `00-${randomBytes(16).toString('hex')}-${randomBytes(8).toString('hex')}-01`}
export function validTraceparent(text){return typeof text==='string'&&/^00-[0-9a-f]{32}-[0-9a-f]{16}-0[1-9a-f]$/.test(text)}
