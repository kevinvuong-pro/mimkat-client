import { it, expect, describe } from 'vitest';

import { formatNumber } from './formatters';

describe('formatters', () => {
  it('formats numbers using the selected locale', () => {
    expect(formatNumber(1234567, 'vi')).toBe('1.234.567');
    expect(formatNumber(1234567, 'en')).toBe('1,234,567');
  });
});
