const SENSITIVE=/^(authorization|password|secret|token|apiKey|creditCard)$/i;
export function redactObject(data){if(Array.isArray(data))return data.map(redactObject);if(!data||typeof data!=='object')return data;
  return Object.fromEntries(Object.entries(data).map(([key,value])=>[key,SENSITIVE.test(key)?'[REDACTED]':redactObject(value)]));}
