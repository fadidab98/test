import React from 'react';
export function GreetingCard({ name }) {
  return React.createElement('h1', { className: 'greeting' }, `Hello ${name}`);
}
