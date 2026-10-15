import {redactObject} from '@aegis/security';
export function createLogger({service='aegis',sink=console.log,clock=()=>new Date().toISOString()}={}){
  const write=(level,message,attributes={})=>sink(JSON.stringify({time:clock(),level,service,message,...redactObject(attributes)}));
  return {info:(message,attrs)=>write('INFO',message,attrs),warn:(message,attrs)=>write('WARN',message,attrs),error:(message,attrs)=>write('ERROR',message,attrs)};
}
