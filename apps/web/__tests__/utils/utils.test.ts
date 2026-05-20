import { describe, it, expect } from 'vitest';
import {
  cn,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatYoY,
  slugify,
  IRISH_COUNTIES,
} from '@/lib/utils';

describe('cn (class merging)', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resolves Tailwind conflicts, last wins', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, null, 'baz')).toBe('foo baz');
  });
});

describe('formatCurrency', () => {
  it('formats euros with no decimal places', () => {
    expect(formatCurrency(350000)).toContain('350,000');
  });

  it('includes the euro symbol', () => {
    expect(formatCurrency(100)).toContain('€');
  });
});

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(1234567)).toMatch(/1[,.]?234[,.]?567/);
  });
});

describe('formatPercent', () => {
  it('formats percentage correctly', () => {
    expect(formatPercent(4.5)).toContain('4.5');
    expect(formatPercent(4.5)).toContain('%');
  });
});

describe('formatYoY', () => {
  it('shows + prefix for positive changes', () => {
    expect(formatYoY(6.2)).toBe('+6.2%');
  });

  it('shows negative prefix for negative changes', () => {
    expect(formatYoY(-1.5)).toBe('-1.5%');
  });

  it('shows + prefix for zero', () => {
    expect(formatYoY(0)).toBe('+0.0%');
  });
});

describe('slugify', () => {
  it('converts to lowercase with hyphens', () => {
    expect(slugify('Housing Market 2024')).toBe('housing-market-2024');
  });

  it('removes special characters', () => {
    expect(slugify('Léargas!')).toBe('leargas');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a  b')).toBe('a-b');
  });
});

describe('IRISH_COUNTIES', () => {
  it('contains 26 counties', () => {
    expect(IRISH_COUNTIES).toHaveLength(26);
  });

  it('includes Dublin', () => {
    expect(IRISH_COUNTIES).toContain('Dublin');
  });

  it('includes Cork', () => {
    expect(IRISH_COUNTIES).toContain('Cork');
  });
});
