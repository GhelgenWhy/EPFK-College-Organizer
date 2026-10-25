import type { HomeLesson } from "../types";
import { formatDate, titleCase } from "../utils/date";
import { SectionHeading } from "./SectionHeading";
import { textOr } from "../../../lib/nullSafe";

export function ScheduleSection({
  lessons,
  date,
}: {
  lessons: HomeLesson[];
  date: Date;
}) {
  return (
    <section
      className="col-start-1 flex min-h-0 min-w-0 flex-col rounded-[19px] bg-surface p-3 max-[960px]:col-span-full max-[760px]:col-span-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]"
      aria-labelledby="today-schedule-heading"
    >
      <SectionHeading
        id="today-schedule-heading"
        title="Розклад на сьогодні"
        subtitle={`${titleCase(formatDate(date, { weekday: "long" }))} · ${lessons.length} пари`}
      />
      {lessons.length === 0 && (
        <p className="m-0 flex flex-1 items-center justify-center p-4 text-sm text-muted">
          На цей день пар немає
        </p>
      )}
      <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
        {lessons.map((lesson, index) => (
          <li
            className={`relative grid min-h-0 flex-1 grid-cols-[92px_minmax(0,1fr)_118px] items-center gap-2 border-b border-[var(--border)] px-2 py-1 last:border-b-0 max-[1200px]:grid-cols-[66px_minmax(0,1fr)_74px] max-[760px]:min-h-[75px] max-[760px]:grid-cols-[64px_minmax(0,1fr)_78px] max-[760px]:gap-2 max-[760px]:px-1 max-[760px]:py-[6px] ${index === 1 ? "my-1 rounded-[13px] border-0 bg-[var(--accent-soft)] before:absolute before:top-[10px] before:bottom-[10px] before:left-[10px] before:w-1 before:rounded-[4px] before:bg-[var(--accent)] before:content-[''] max-[760px]:pl-[14px] max-[760px]:pr-2" : ""}`}
            key={lesson.id}
          >
            <time
              className={`flex h-[46px] flex-col justify-center gap-1 border-r border-[var(--border)] text-sm leading-[1.1] font-bold tabular-nums text-primary max-[1200px]:text-[11px] max-[760px]:h-12 max-[760px]:text-xs ${index === 1 ? "pl-3" : ""}`}
              dateTime={lesson.startsAt}
            >
              <span>{textOr(lesson.startsAt, '—')}</span>
              <span className="text-[11px] font-medium text-[var(--text-muted)] max-[1200px]:text-[9px] max-[760px]:text-[10px]">
                {textOr(lesson.endsAt, '')}
              </span>
            </time>
            <div className="min-w-0">
              <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.4] font-bold text-primary max-[760px]:text-[11px]">
                {lesson.title}
              </h3>
              <p className="mt-[5px] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[var(--text-muted)] max-[760px]:text-[9px]">
                {index === 1 ? "Онлайн · Google Meet" : textOr(lesson.location, "Аудиторію не вказано")}
              </p>
            </div>
            {index === 0 ? (
              <span className="inline-flex min-h-[26px] min-w-[74px] justify-self-end items-center justify-center rounded-[9px] bg-[var(--surface-muted)] px-2 text-[10px] font-semibold whitespace-nowrap text-[var(--text-muted)] max-[1200px]:min-w-0 max-[1200px]:text-[8px] max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">
                Завершено
              </span>
            ) : index === 1 ? (
              <span className="inline-flex min-h-[26px] min-w-[74px] justify-self-end items-center justify-center rounded-[9px] bg-[var(--success-soft)] px-2 text-[10px] font-semibold whitespace-nowrap text-[var(--accent-hover)] max-[1200px]:min-w-0 max-[1200px]:text-[8px] max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">
                Наступна
              </span>
            ) : (
              <span className="inline-flex min-h-[26px] min-w-[74px] justify-self-end items-center justify-center rounded-[9px] bg-[var(--surface-muted)] px-2 text-[10px] font-semibold whitespace-nowrap text-[var(--text-muted)] max-[1200px]:min-w-0 max-[1200px]:text-[8px] max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">
                Пізніше
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
