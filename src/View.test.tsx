import { describe, expect, it } from 'vitest';
import { View } from './View';

describe('View component', () => {
  it('exports a React component', () => {
    expect(typeof View).toBe('function');
  });
});
