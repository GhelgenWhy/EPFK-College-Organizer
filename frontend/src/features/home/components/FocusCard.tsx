import type { CalendarFilterType } from "../../calendar/types";
import type { HomeDeadline, HomeLesson } from "../types";
import { formatDateKey, parseLocalDate } from "../utils/date";

export function FocusCard({
  date,
  lessons,
  deadlines,
  activeTaskCount,
  onOpenCalendar,
  onOpenSchedule,
}: {
  date: Date;
  lessons: HomeLesson[];
  deadlines: HomeDeadline[];
  activeTaskCount: number;
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
  onOpenSchedule: () => void;
}) {
  const dateKey = formatDateKey(date);
  const urgentDeadlines = deadlines.filter(
    (deadline) => deadline.urgent || deadline.date === dateKey,
  );
  const metrics = [
    {
      value: lessons.length,
      label: "пари",
      detail: "Сьогодні в розкладі",
      action: onOpenSchedule,
    },
    {
      value: urgentDeadlines.length,
      label: "дедлайни",
      detail: "Потребують уваги",
      action: () =>
        onOpenCalendar(
          deadlines[0] ? parseLocalDate(deadlines[0].date) : date,
          "DEADLINES_ONLY",
        ),
      urgent: true,
    },
    {
      value: activeTaskCount,
      label: "завдання",
      detail: "Ще не завершені",
      action: () => onOpenCalendar(date, "DEADLINES_ONLY"),
    },
  ];

  return (
    <section
      className="flex min-h-[clamp(150px,20vh,180px)] min-w-0 flex-col justify-center rounded-[19px] bg-surface px-4 py-3 max-[760px]:col-start-1 max-[760px]:min-h-[190px] max-[760px]:p-[17px]"
      aria-labelledby="focus-heading"
    >
      <h2
        id="focus-heading"
        className="text-lg font-bold tracking-[-0.025em] text-primary max-[760px]:text-xl"
      >
        Аджента
      </h2>
      <p className="mt-1 text-[11px] leading-[1.35] text-[var(--text-muted)] max-[760px]:text-[11px]">
        «те, що має бути зроблено» або «справа, яку слід виконати»
      </p>
      <div className="mt-2 grid grid-cols-3 gap-[6px]">
        {metrics.map((metric) => (
          <button
            className={`grid min-h-[66px] min-w-0 grid-cols-[auto_1fr] content-center items-baseline justify-start gap-x-[6px] rounded-[13px] border-0 p-[7px] text-left text-primary transition-[filter] hover:brightness-[0.97] max-[1200px]:grid-cols-1 max-[760px]:min-h-[82px] max-[760px]:grid-cols-[auto_1fr] max-[760px]:p-[8px_7px] cursor-pointer ${metric.urgent ? "bg-[var(--danger-soft)]" : "bg-[var(--surface-muted)]"}`}
            key={metric.label}
            onClick={metric.action}
            type="button"
          >
            <span className="text-[22px] leading-none font-bold tracking-[-0.04em] tabular-nums max-[1200px]:text-xl max-[760px]:text-[21px]">
              {metric.value}
            </span>
            <span className="min-w-0 whitespace-nowrap text-xs font-bold max-[1200px]:text-[11px] max-[760px]:text-[11px]">
              {metric.label}
            </span>
            <span className="col-span-full mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-[var(--text-muted)] max-[760px]:mt-[10px] max-[760px]:text-[8px]">
              {metric.detail}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
