import React from 'react';
import {test, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {View, Context} from './View';
afterEach(cleanup);
test('renders', () => { render(<Context.Provider value={{label: 'Ready'}}><View /></Context.Provider>); expect(screen.getByText('Ready')).toBeTruthy(); });
