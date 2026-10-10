import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GreetingCard } from '../src/GreetingCard.js';

test('React GreetingCard renders dynamic content', () => {
  const html = renderToStaticMarkup(React.createElement(GreetingCard, { name: 'Pipeline' }));
  assert.match(html, /Hello Pipeline/);
  assert.match(html, /class="greeting"/);
});

test('React GreetingCard supports another project name', () => {
  const html = renderToStaticMarkup(React.createElement(GreetingCard, { name: 'React Lab' }));
  assert.match(html, /Hello React Lab/);
});
