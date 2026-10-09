import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdir, writeFile } from 'node:fs/promises';
import App from '../src/App.mjs';
const html = '<!doctype html><html><head><meta charset="utf-8"><title>Order Dashboard</title></head><body>'
  + renderToStaticMarkup(React.createElement(App)) + '</body></html>';
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', html);
console.log('Rendered dist/index.html');
