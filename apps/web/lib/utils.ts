import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'EUR', locale = 'en-IE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, locale = 'en-IE'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatPercent(value: number, locale = 'en-IE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatWithNumberFormat(
  eurValue: number,
  format: 'western' | 'indian',
  eurToInr?: number | null
): string {
  if (format === 'indian' && eurToInr) {
    const inr = eurValue * eurToInr;
    if (inr >= 10_000_000) return `₹${(inr / 10_000_000).toFixed(2)} Cr`;
    if (inr >= 100_000) return `₹${(inr / 100_000).toFixed(2)} L`;
    return `₹${inr.toLocaleString('en-IN')}`;
  }
  if (format === 'indian') {
    if (eurValue >= 10_000_000) return `€${(eurValue / 10_000_000).toFixed(2)} Cr`;
    if (eurValue >= 100_000) return `€${(eurValue / 100_000).toFixed(2)} L`;
    return `€${eurValue.toLocaleString('en-IN')}`;
  }
  if (eurValue >= 1_000_000_000) return `€${(eurValue / 1_000_000_000).toFixed(1)}B`;
  if (eurValue >= 1_000_000) return `€${(eurValue / 1_000_000).toFixed(1)}M`;
  if (eurValue >= 1_000) return `€${(eurValue / 1_000).toFixed(0)}K`;
  return `€${eurValue}`;
}

export function formatPopulation(value: number, format: 'western' | 'indian'): string {
  if (format === 'indian') {
    if (value >= 10_000_000) return `${(value / 10_000_000).toFixed(2)} Cr`;
    if (value >= 100_000) return `${(value / 100_000).toFixed(2)} L`;
    return value.toLocaleString('en-IN');
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  return value.toLocaleString('en-IE');
}

export function formatYoY(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}

export function downloadCsv(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? '');
          return val.includes(',') ? `"${val}"` : val;
        })
        .join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export const IRISH_COUNTIES = [
  'Carlow',
  'Cavan',
  'Clare',
  'Cork',
  'Donegal',
  'Dublin',
  'Galway',
  'Kerry',
  'Kildare',
  'Kilkenny',
  'Laois',
  'Leitrim',
  'Limerick',
  'Longford',
  'Louth',
  'Mayo',
  'Meath',
  'Monaghan',
  'Offaly',
  'Roscommon',
  'Sligo',
  'Tipperary',
  'Waterford',
  'Westmeath',
  'Wexford',
  'Wicklow',
] as const;

export type IrishCounty = (typeof IRISH_COUNTIES)[number];
