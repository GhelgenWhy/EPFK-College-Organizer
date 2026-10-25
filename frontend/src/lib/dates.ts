/**
 * Date helpers for the European (Ukrainian) display format DD.MM.YYYY.
 * Inputs are ISO calendar dates (YYYY-MM-DD) as sent by the backend.
 */

/** "2026-10-26" → "26.10.2026". Non-ISO input is returned unchanged. */
export function formatEuropeanDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

/**
 * Replaces an ISO calendar date at the start of a label ("2026-10-31 · 08:06")
 * with the European format ("31.10.2026 · 08:06").
 */
export function formatEuropeanLabel(label: string): string {
  return label.replace(/^(\d{4})-(\d{2})-(\d{2})/, (_, year, month, day) => `${day}.${month}.${year}`);
}
