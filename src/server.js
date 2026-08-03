import http from 'node:http';
import { add } from './math.js';

const port = Number(process.env.PORT || 3000);

const server = http.createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ app: 'cicd-platform-demo', sample: add(2, 3) }));
});

server.listen(port, () => {
  console.log(`demo app listening on ${port}`);
});
