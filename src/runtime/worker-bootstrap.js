import {verifyRuntimePolicy} from './compatibility.js';
import {memoryStore} from '../adapters/memory-store.js';
import {handleDelivery} from '../application/queue-handler.js';
export async function bootstrapWorker(batches) {
  verifyRuntimePolicy();
  const store=memoryStore();
  for (const batch of batches) await handleDelivery(batch,store);
  return store.all();
}
