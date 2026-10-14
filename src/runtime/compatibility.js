import {readFileSync} from 'node:fs';
export function verifyRuntimePolicy(version=process.versions.node) {
  const policy=JSON.parse(readFileSync(new URL('../../config/runtime.policy.json',import.meta.url),'utf8'));
  const required=policy.productionRuntime.nodeMajor;
  const actual=Number(String(version).replace(/^v/,'').split('.')[0]);
  if (!Number.isInteger(actual) || actual < required) {
    const error=new Error(`Unsupported CI runtime: Node.js ${version} does not meet production runtime `+
      `Node.js >=${required}. Runtime profile 'node-${actual}' must be upgraded to node-${required} for ${policy.service}.`);
    error.code='ERR_UNSUPPORTED_NODE_VERSION';
    throw error;
  }
  return {actual,required,service:policy.service};
}
