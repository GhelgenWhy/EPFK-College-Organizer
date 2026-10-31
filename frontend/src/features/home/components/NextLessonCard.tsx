import type { HomeLesson } from '../types';
import { textOr } from '../../../lib/nullSafe';

export type FeaturedState = 'current' | 'next' | 'none';

interface Look { card: string; ink: string; badge: string }

// Current lesson: #ffd86f card with a #fff6dc badge.
const CURRENT_LOOK: Look = {
  card: 'bg-[var(--current-lesson)]',
  ink: 'text-[#4A3500]',
  badge: 'bg-[var(--current-lesson-soft)] text-[#4A3500]',
};

// Next lesson: cyan card with a light cyan badge.
const NEXT_LOOK: Look = {
  card: 'bg-accent',
  ink: 'text-on-accent',
  badge: 'bg-accent-soft text-accent-hover',
};

/**
 * Big card for the dashboard. Three looks: the lesson in progress (yellow), the next lesson
 * (cyan), and an empty day rendered as a neutral card instead of blank space.
 */
export function NextLessonCard({ lesson, state }: { lesson: HomeLesson | null; state: FeaturedState }) {
  if (!lesson || state === 'none') {
    // Empty day: solid white card with readable grey text; the "free day" badge gets its own
    // tinted fill so it does not disappear into the white card.
    return (
      <section className="relative flex min-h-[clamp(150px,20vh,180px)] items-center justify-center overflow-hidden rounded-[19px] bg-surface p-4 text-center shadow-[0_1px_3px_var(--shadow-soft-color)] max-[1200px]:min-w-0 max-[760px]:col-start-1 max-[760px]:min-h-[208px] max-[760px]:p-[17px]" aria-labelledby="next-lesson-heading">
        <div>
          <span className="inline-flex min-h-7 items-center rounded-lg bg-[var(--accent-soft)] px-3 text-[11px] font-bold uppercase text-[var(--accent-hover)] max-[760px]:min-h-[26px] max-[760px]:text-[10px]">Вільний день</span>
          <h2 id="next-lesson-heading" className="mt-[13px] text-[clamp(18px,1.25vw,24px)] leading-[1.25] font-bold text-[var(--text-secondary)]">Сьогодні пар немає</h2>
          <p className="mt-[7px] text-sm text-[var(--text-muted)]">Наступна пара з’явиться тут, коли розклад це передбачає.</p>
        </div>
      </section>
    );
  }

  const isCurrent = state === 'current';
  const look = isCurrent ? CURRENT_LOOK : NEXT_LOOK;
  const cardClass = look.card;
  const inkClass = look.ink;
  const badgeClass = look.badge;
  const badgeLabel = isCurrent ? 'Зараз' : 'Наступна пара';

  return (
    <section className={`relative flex min-h-[clamp(150px,20vh,180px)] items-center overflow-hidden rounded-[19px] p-4 max-[1200px]:min-w-0 max-[760px]:col-start-1 max-[760px]:min-h-[208px] max-[760px]:p-[17px] ${cardClass}`} aria-labelledby="next-lesson-heading">
      <div className="min-w-0 pr-[220px] max-[1200px]:pr-[195px] max-[760px]:self-start max-[760px]:pr-0">
        <span className={`inline-flex min-h-7 items-center rounded-lg px-3 text-[11px] font-bold uppercase max-[760px]:min-h-[26px] max-[760px]:text-[10px] ${badgeClass}`}>{badgeLabel}</span>
        <p className={`mt-[11px] text-[clamp(25px,1.8vw,34px)] leading-[1.08] font-bold tracking-[-0.035em] tabular-nums ${inkClass} max-[760px]:mt-[9px] max-[760px]:text-[26px]`}>{textOr(lesson.startsAt, '—')} – {textOr(lesson.endsAt, '—')}</p>
        <h2 id="next-lesson-heading" className={`mt-[13px] text-[clamp(18px,1.25vw,24px)] leading-[1.25] font-bold tracking-[-0.025em] ${inkClass} max-[760px]:mt-2 max-[760px]:max-w-full max-[760px]:text-lg`}>{lesson.title}</h2>
        <p className={`mt-[7px] text-sm leading-[1.4] ${inkClass} opacity-90 max-[760px]:mt-[5px] max-[760px]:text-xs`}>{textOr(lesson.teacher, 'Викладача не вказано')} <span className="px-1" aria-hidden="true">·</span> онлайн-заняття</p>
      </div>
      {lesson.meetingUrl && (
        <a className="absolute right-4 bottom-3 inline-flex min-h-[38px] min-w-[195px] items-center justify-center gap-[9px] rounded-[11px] bg-surface px-4 text-xs font-bold text-accent-hover no-underline transition-transform hover:-translate-y-px hover:bg-surface-hover max-[760px]:min-h-9 max-[760px]:min-w-0 max-[760px]:text-[11px]" href={lesson.meetingUrl} target="_blank" rel="noreferrer">
          Приєднатися до Meet <span aria-hidden="true">→</span>
        </a>
      )}
    </section>
  );
}
