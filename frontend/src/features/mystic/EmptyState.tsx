import { CheshireCat } from './CheshireCat';
import type { CheshirePose } from './poses';

export type EmptyReason =
  | 'no-group'
  | 'not-synced'
  | 'no-schedule'
  | 'no-data';

const COPY: Record<EmptyReason, { pose: CheshirePose; title: string; hint: string }> = {
  // The peeking pose is reserved for the events page; empty states use other poses.
  'no-group': {
    pose: 'sleep',
    title: 'Групу ще не обрано',
    hint: 'Оберіть свою групу в профілі, щоб побачити розклад.',
  },
  'not-synced': {
    pose: 'wave',
    title: 'Дані ще не завантажені',
    hint: 'Натисніть «Остання синхронізація», щоб оновити дані з Moodle.',
  },
  'no-schedule': {
    pose: 'sleep',
    title: 'Розклад ще не внесено',
    hint: 'Адміністрація або староста групи ще не додали розклад для вашої групи.',
  },
  'no-data': {
    pose: 'tea',
    title: 'Тут поки порожньо',
    hint: '',
  },
};

/**
 * Пустое состояние с котом. Причина задаётся явно, а не по ошибке сервера: отсутствие данных
 * это не сбой. Кот декоративный, поэтому текст всё равно передаёт смысл.
 */
export function EmptyState({
  reason = 'no-data',
  title,
  hint,
  height = 120,
  className = '',
}: {
  reason?: EmptyReason;
  title?: string;
  hint?: string;
  height?: number;
  className?: string;
}) {
  const copy = COPY[reason];
  return (
    <div className={`flex flex-col items-center justify-center gap-3 px-4 py-6 text-center ${className}`}>
      <CheshireCat pose={copy.pose} height={height} />
      <p className="m-0 text-base font-bold text-[var(--text-secondary)]">{title ?? copy.title}</p>
      {(hint ?? copy.hint) && <p className="m-0 max-w-[320px] text-sm text-[var(--text-muted)]">{hint ?? copy.hint}</p>}
    </div>
  );
}
