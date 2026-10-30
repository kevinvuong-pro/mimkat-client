import type { Locale } from '@/types/i18n';

const localeMap: Record<Locale, string> = { en: 'en-US', vi: 'vi-VN' };

export function formatDate(value: string | number | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMap[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatShortDate(value: string | number | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMap[locale], {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMap[locale]).format(value);
}
