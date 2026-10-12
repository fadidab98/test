import React from 'react';
import {test, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {View, Context} from './View';
afterEach(cleanup);
test('renders', () => { render(<View />); expect(screen.getByText('Ready')).toBeTruthy(); });
