import type { HomeLesson } from '../../features/home/types';

export function NextLessonCard({ lesson }: { lesson: HomeLesson }) {
  return (
    <section className="relative flex min-h-[clamp(150px,20vh,180px)] items-center overflow-hidden rounded-[19px] bg-accent p-4 text-on-accent max-[1200px]:min-w-0 max-[760px]:col-start-1 max-[760px]:min-h-[208px] max-[760px]:p-[17px]" aria-labelledby="next-lesson-heading">
      <div className="min-w-0 pr-[220px] max-[1200px]:pr-[195px] max-[760px]:self-start max-[760px]:pr-0">
        <span className="inline-flex min-h-7 items-center rounded-lg bg-accent-soft px-3 text-[11px] font-bold uppercase text-accent-hover max-[760px]:min-h-[26px] max-[760px]:text-[10px]">Наступна пара</span>
        <p className="mt-[11px] text-[clamp(25px,1.8vw,34px)] leading-[1.08] font-bold tracking-[-0.035em] tabular-nums text-on-accent max-[760px]:mt-[9px] max-[760px]:text-[26px]">{lesson.startsAt} – {lesson.endsAt}</p>
        <h2 id="next-lesson-heading" className="mt-[13px] text-[clamp(18px,1.25vw,24px)] leading-[1.25] font-bold tracking-[-0.025em] text-on-accent max-[760px]:mt-2 max-[760px]:max-w-full max-[760px]:text-lg">{lesson.title}</h2>
        <p className="mt-[7px] text-sm leading-[1.4] text-accent-soft max-[760px]:mt-[5px] max-[760px]:text-xs">{lesson.teacher} <span className="px-1" aria-hidden="true">·</span> онлайн-заняття</p>
      </div>
      {lesson.meetingUrl && (
        <a className="absolute right-4 bottom-3 inline-flex min-h-[38px] min-w-[195px] items-center justify-center gap-[9px] rounded-[11px] bg-surface px-4 text-xs font-bold text-accent-hover no-underline transition-transform hover:-translate-y-px hover:bg-surface-hover max-[760px]:min-h-9 max-[760px]:min-w-0 max-[760px]:text-[11px]" href={lesson.meetingUrl} target="_blank" rel="noreferrer">
          Приєднатися до Meet <span aria-hidden="true">→</span>
        </a>
      )}
    </section>
  );
}
