export class RegistryResponseError extends Error {constructor(status,resource,retryAfter){super(`Artifact registry returned HTTP ${status} Service Unavailable while fetching ${resource}; retry-after=${retryAfter ?? 'none'}`);this.name='RegistryResponseError';this.httpStatus=status;}}
export class RegistryClient {
  constructor(baseUrl){this.baseUrl=baseUrl;}
  async getMetadata(){const r=await fetch(`${this.baseUrl}/v1/metadata`,{signal:AbortSignal.timeout(3000)});if(!r.ok)throw new Error(`Metadata HTTP ${r.status}`);return r.json();}
  async fetchArtifact(key){const r=await fetch(`${this.baseUrl}/v1/artifacts/${encodeURIComponent(key)}`,{signal:AbortSignal.timeout(3000)});
    if(r.status===503)throw new RegistryResponseError(503,key,r.headers.get('retry-after'));
    if(!r.ok)throw new Error(`Artifact request HTTP ${r.status}`);
    return r.json();}
}
