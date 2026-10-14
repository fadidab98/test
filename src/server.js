import { createServer } from 'node:http';
import { summarize } from './services/orders.js';
const example = { customerId: 'demo', lines: [{ unitPriceCents: 400, quantity: 2 }] };
createServer((_req, res) => {res.setHeader('content-type','application/json');res.end(JSON.stringify(summarize(example)));})
  .listen(8088, () => console.log('failure-lab-50 ready'));
