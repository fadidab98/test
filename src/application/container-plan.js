import {readFile} from 'node:fs/promises';
export function declaredStages(dockerfile) {return [...dockerfile.matchAll(/^FROM\s+\S+\s+AS\s+([\w-]+)\s*$/gim)].map(m=>m[1].toLowerCase());}
export function missingCopyStages(dockerfile) {
  const known=new Set(declaredStages(dockerfile));
  return [...dockerfile.matchAll(/^COPY\s+--from=([\w-]+)\s+/gim)]
    .map(m=>m[1].toLowerCase()).filter(name=>!known.has(name));
}
export async function validateContainerStages(path){
  const dockerfile=await readFile(path,'utf8');
  const missing=missingCopyStages(dockerfile);
  if(missing.length) throw new Error(`Dockerfile invalid: COPY --from=${missing[0]} refers to unknown build stage; declared stages: ${declaredStages(dockerfile).join(', ')}`);
  return true;
}
