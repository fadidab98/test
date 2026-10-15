import {NotificationWorker} from './handler.mjs';
import {createLogger} from '@aegis/observability';
const logger=createLogger({service:'aegis-worker'});
const worker=new NotificationWorker({logger});
logger.info('worker.started',{mode:'standalone',behavior:'stdin-jsonl'});
for await(const line of process.stdin){
  try{const event=JSON.parse(String(line));await worker.process(event)}catch(error){logger.error('worker.failed',{message:error.message})}
}
