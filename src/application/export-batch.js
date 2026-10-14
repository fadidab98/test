import { collectEvents } from './audit-stream.js';
import { renderJsonLines } from '../infra/formatters/json-lines.js';
export async function exportBatch(store,ids,format) {
  const rows=collectEvents(store,ids);
  if(format==='jsonl') return renderJsonLines(rows);
  if(format==='csv') {
    const { renderCsv }=await import('../infra/formatters/csv-plugin.js');
    return renderCsv(rows);
  }
  throw new Error('Unsupported export format: '+format);
}
