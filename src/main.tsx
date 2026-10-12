import React from 'react';
import {createRoot} from 'react-dom/client';
import {View, Context} from './View';
import {message} from '@/message';
createRoot(document.getElementById('root')!).render(<Context.Provider value={{label: message}}><View /></Context.Provider>);
