/**
 * Null-safe formatting helpers for values that the backend may send as null
 * (weekends without lessons, tasks without deadlines, events without a place).
 */

export const EMPTY_TEXT = '—';

/** Returns the trimmed string, or the fallback when the value is empty or not a string. */
export function textOr(value: unknown, fallback = EMPTY_TEXT): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

/** True when the value is a parseable ISO-like date string. */
export function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && value !== '' && !Number.isNaN(Date.parse(value));
}

/** Formats an ISO date-time in Kyiv time, or returns the fallback for null/invalid input. */
export function formatKyivDateTime(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions,
  fallback = 'Без дедлайну',
): string {
  if (!isValidDate(value)) return fallback;
  return new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', ...options }).format(new Date(value));
}
