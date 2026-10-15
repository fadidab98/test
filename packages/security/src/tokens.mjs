import {createHmac,timingSafeEqual} from 'node:crypto';
import {domainError} from '@aegis/contracts';
const encode=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
export function issueToken(payload,secret,{expiresInSeconds=3600,now=Date.now()}={}){
  if(!secret||secret.length<12)throw domainError('WEAK_SECRET','Token secret must be at least 12 characters');
  const claims={...payload,iat:Math.floor(now/1000),exp:Math.floor(now/1000)+expiresInSeconds};
  const body=encode(claims);const sig=createHmac('sha256',secret).update(body).digest('base64url');return `${body}.${sig}`;
}
export function verifyToken(token,secret,{now=Date.now()}={}){
  const [body,sig,extra]=String(token||'').split('.');if(!body||!sig||extra)throw domainError('UNAUTHORIZED','Invalid access token');
  const expected=createHmac('sha256',secret).update(body).digest();
  let provided;try{provided=Buffer.from(sig,'base64url')}catch{throw domainError('UNAUTHORIZED','Invalid signature')}
  if(provided.length!==expected.length||!timingSafeEqual(provided,expected))throw domainError('UNAUTHORIZED','Invalid signature');
  let claims;try{claims=JSON.parse(Buffer.from(body,'base64url').toString('utf8'))}catch{throw domainError('UNAUTHORIZED','Invalid claims')}
  if(!Number.isFinite(claims.exp)||claims.exp<=now/1000)throw domainError('TOKEN_EXPIRED','Access token expired');return claims;
}
