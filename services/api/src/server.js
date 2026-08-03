import http from 'node:http';

const port = Number(process.env.PORT || 3101);

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ service: 'api', path: request.url }));
});

server.listen(port, () => {
  console.log(`api listening on ${port}`);
});
