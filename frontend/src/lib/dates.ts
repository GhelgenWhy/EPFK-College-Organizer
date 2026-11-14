
export function formatEuropeanDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

export function formatEuropeanLabel(label: string): string {
  return label.replace(/^(\d{4})-(\d{2})-(\d{2})/, (_, year, month, day) => `${day}.${month}.${year}`);
}

export type LessonState = 'done' | 'current' | 'upcoming';

function clockToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function kyivNowMinutes(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
}

export function lessonState(startsAt: string, endsAt: string, nowMinutes: number): LessonState {
  const start = clockToMinutes(startsAt);
  const end = clockToMinutes(endsAt);
  if (start === null || end === null) return 'upcoming';
  if (nowMinutes >= end) return 'done';
  if (nowMinutes >= start) return 'current';
  return 'upcoming';
}

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
