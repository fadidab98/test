import {releaseOf,releaseKey} from '../domain/release.js';
export async function promoteRelease(raw,registry,store){
  const release=releaseOf(raw);
  const meta=await registry.getMetadata();
  if(meta.status !== 'ready') throw new Error('Registry metadata is not ready');
  const manifest=await registry.fetchArtifact(releaseKey(release));
  if(!manifest.signature) throw new Error('Artifact signature missing');
  store.save(releaseKey(release),{...release,signature:manifest.signature});
  return store.get(releaseKey(release));
}
