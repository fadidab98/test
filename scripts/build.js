import { mkdir, writeFile } from 'node:fs/promises';
import { createHealthReport } from '../src/health.js';
import { nextAction, summarizePipeline } from '../src/pipelineSummary.js';

await mkdir('dist', { recursive: true });
const summary = summarizePipeline([
  { step_id: 'install', status: 'SUCCEEDED' },
  { step_id: 'test', status: 'SUCCEEDED' },
  { step_id: 'build', status: 'SUCCEEDED' }
]);

await writeFile(
  'dist/build-info.json',
  JSON.stringify(
    {
      app: 'cicd-platform-demo',
      builtAt: new Date().toISOString(),
      health: createHealthReport({
        serviceName: 'cicd-platform-demo',
        version: '1.0.0',
        uptimeSeconds: 0
      }),
      pipeline: {
        summary,
        next_action: nextAction(summary)
      }
    },
    null,
    2
  )
);

console.log('build output written to dist/build-info.json');
