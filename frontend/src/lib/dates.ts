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

/** Lesson state by the Kyiv clock: finished, current (in progress) or upcoming. */
export type LessonState = 'done' | 'current' | 'upcoming';

/** "9:35" or "09:35" → minutes from midnight. */
function clockToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Minutes from midnight of "now" in Europe/Kyiv. */
export function kyivNowMinutes(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
}

/** State of a lesson between its start and end ("9:35" – "10:55") at the given Kyiv minute. */
export function lessonState(startsAt: string, endsAt: string, nowMinutes: number): LessonState {
  const start = clockToMinutes(startsAt);
  const end = clockToMinutes(endsAt);
  if (start === null || end === null) return 'upcoming';
  if (nowMinutes >= end) return 'done';
  if (nowMinutes >= start) return 'current';
  return 'upcoming';
}

/**
 * Last successful Moodle check, shown in the header: "26.10.26, 09:15" in Kyiv time,
 * or "ще не було" when the account never synced.
 */
export function formatLastSync(iso: string | null): string {
  if (!iso) return 'ще не було';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'ще не було';
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(date);
}
