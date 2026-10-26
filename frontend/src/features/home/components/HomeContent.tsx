import type { CalendarFilterType } from "../../calendar/types";
import { useTaskCompletion } from "../../tasks/hooks/useTaskCompletion";
import type { HomeData } from "../types";
import { formatDate, titleCase } from "../utils/date";
import { NextLessonCard } from "./NextLessonCard";
import { FocusCard } from "./FocusCard";
import { ScheduleSection } from "./ScheduleSection";
import { DeadlinesSection } from "./DeadlinesSection";
import { TasksSection } from "./TasksSection";
import { EventsSection } from "./EventsSection";

export function HomeContent({
  onOpenCalendar,
  onOpenSchedule,
  data,
  storageKey,
}: {
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
  onOpenSchedule: () => void;
  data: HomeData;
  storageKey: string;
}) {
  const { date, deadlines, events, lessons, tasks } = data;
  const { completedTaskIds, toggleTask } = useTaskCompletion(tasks, storageKey);
  const completedTaskCount = tasks.filter((task) =>
    completedTaskIds.includes(task.id),
  ).length;
  const activeTaskCount = tasks.length - completedTaskCount;
  const weekday = titleCase(formatDate(date, { weekday: "long" }));

  return (
    <main
      className="flex min-h-0 flex-1 flex-col gap-[clamp(8px,1.4vh,14px)] overflow-hidden px-[18px] py-[clamp(12px,2vh,20px)] pr-5 [scrollbar-color:var(--scrollbar)_transparent] [scrollbar-width:thin] max-[1200px]:px-6 max-[960px]:overflow-auto [@media(max-height:700px)]:overflow-auto max-[760px]:gap-[17px] max-[760px]:px-1 max-[760px]:py-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-[var(--focus)] [&_button:focus-visible]:outline-offset-[3px] [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-[var(--focus)] [&_a:focus-visible]:outline-offset-[3px] [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-[var(--focus)] [&_input:focus-visible]:outline-offset-[3px]"
      aria-labelledby="home-heading"
    >
      <div className="flex min-h-[clamp(48px,7vh,64px)] shrink-0 items-center justify-between gap-5 max-[760px]:min-h-[62px]">
        <div>
          <h1
            id="home-heading"
            className="text-[clamp(30px,1.8vw,34px)] font-bold leading-[1.15] tracking-[-0.045em] text-primary max-[760px]:text-[30px]"
          >
            {formatDate(date, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </h1>
          <p className="mt-[7px] text-[15px] text-secondary max-[760px]:mt-[3px] max-[760px]:text-[13px]">
            {weekday}
          </p>
        </div>
        <button
          className="mr-[47px] inline-flex min-h-[46px] min-w-[232px] cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-surface px-5 text-[13px] font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent-soft)] hover:bg-[var(--surface-hover)] max-[1200px]:mr-0 max-[760px]:min-h-10 max-[760px]:min-w-0 max-[760px]:px-[11px] max-[760px]:text-[11px]"
          onClick={() => onOpenCalendar(date)}
          type="button"
        >
          Відкрити календар
        </button>
      </div>

      <div className="grid min-h-0 shrink-0 items-stretch grid-cols-[minmax(0,1.535fr)_minmax(0,1fr)] gap-[clamp(12px,2.5vw,36px)] max-[1200px]:gap-5 max-[760px]:grid-cols-1 max-[760px]:gap-3">
        {/* Server returns only lessons still ahead of now, so the first is the current or next one. */}
        {lessons[0] ? (
          <NextLessonCard lesson={lessons[0]} />
        ) : (
          <p className="rounded-[19px] bg-surface p-4 text-secondary">
            Сьогодні пар немає.
          </p>
        )}
        <FocusCard
          date={date}
          lessons={lessons}
          deadlines={deadlines}
          activeTaskCount={activeTaskCount}
          onOpenCalendar={onOpenCalendar}
          onOpenSchedule={onOpenSchedule}
        />
      </div>

      <div className="grid min-h-0 flex-1 items-stretch grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-[clamp(10px,1.4vw,20px)] gap-y-[clamp(8px,1.4vh,14px)] max-[960px]:flex-none max-[960px]:grid-cols-2 max-[960px]:gap-[18px] [@media(max-height:700px)]:min-h-[420px] [@media(max-height:700px)]:flex-none max-[760px]:grid-cols-1 max-[760px]:gap-3">
        <ScheduleSection lessons={lessons} date={date} />
        <DeadlinesSection
          deadlines={deadlines}
          onOpenCalendar={onOpenCalendar}
        />
        <TasksSection
          tasks={tasks}
          completedTaskIds={completedTaskIds}
          onToggleTask={toggleTask}
        />
      </div>

      <EventsSection
        events={events}
        date={date}
        onOpenCalendar={onOpenCalendar}
      />
    </main>
  );
}
