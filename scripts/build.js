import { mkdir, writeFile } from 'node:fs/promises';
import { createHealthReport } from '../src/health.js';
import { nextAction, summarizePipeline } from '../src/pipelineSummary.js';

if (process.env.CI_DEMO_FIX !== 'true') {
  console.error('CI demo build failure: CI_DEMO_FIX must be true for this branch.');
  console.error('Moderator fix hint: override the failed build command with CI_DEMO_FIX=true npm run build.');
  process.exit(1);
}

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
