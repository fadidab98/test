import React from 'react';
import { createRoot } from 'react-dom/client';
import { View } from './View';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <View />
  </React.StrictMode>
);
