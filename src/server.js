import http from 'node:http';
import { createHealthReport } from './health.js';
import { add } from './math.js';
import { nextAction, summarizePipeline } from './pipelineSummary.js';

const port = Number(process.env.PORT || 3000);

const server = http.createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(createHealthReport({
      serviceName: 'cicd-platform-demo',
      version: '1.0.0',
      uptimeSeconds: process.uptime()
    })));
    return;
  }

  if (request.url === '/pipeline-summary') {
    const summary = summarizePipeline([
      { step_id: 'install', status: 'SUCCEEDED' },
      { step_id: 'test', status: 'SUCCEEDED' },
      { step_id: 'build', status: 'SUCCEEDED' }
    ]);
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ summary, next_action: nextAction(summary) }));
    return;
  }

  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ app: 'cicd-platform-demo', sample: add(2, 3) }));
});

server.listen(port, () => {
  console.log(`demo app listening on ${port}`);
});
