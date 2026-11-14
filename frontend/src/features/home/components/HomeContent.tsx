import { CheshireCat } from '../../mystic/CheshireCat';
import type { CalendarFilterType } from "../../calendar/types";
import { useTaskCompletion } from "../../tasks/hooks/useTaskCompletion";
import type { HomeData } from "../types";
import { NextLessonCard, type FeaturedState } from "./NextLessonCard";
import { FocusCard } from "./FocusCard";
import { ScheduleSection } from "./ScheduleSection";
import { DeadlinesSection } from "./DeadlinesSection";
import { TasksSection } from "./TasksSection";
import { EventsSection } from "./EventsSection";
import { kyivNowMinutes, lessonState } from "../../../lib/dates";
import type { HomeLesson } from "../types";

function pickFeaturedLesson(lessons: HomeLesson[], nowMinutes: number): { lesson: HomeLesson | null; state: FeaturedState } {
  const current = lessons.find((lesson) => lessonState(lesson.startsAt, lesson.endsAt, nowMinutes) === "current");
  if (current) return { lesson: current, state: "current" };
  const next = lessons.find((lesson) => lessonState(lesson.startsAt, lesson.endsAt, nowMinutes) === "upcoming");
  if (next) return { lesson: next, state: "next" };
  return { lesson: null, state: "none" };
}

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
  const { date, deadlines, events, lessons, tasks, summary } = data;
  const featured = pickFeaturedLesson(lessons, kyivNowMinutes());
  const { completedTaskIds } = useTaskCompletion(tasks, storageKey);
  const completedTaskCount = tasks.filter((task) =>
    completedTaskIds.includes(task.id),
  ).length;
  const activeTaskCount = tasks.length - completedTaskCount;

  return (
    <main
      className="flex min-h-0 flex-1 flex-col gap-[clamp(8px,1.4vh,14px)] overflow-x-clip px-[18px] py-[clamp(12px,2vh,20px)] pr-5 [scrollbar-color:var(--scrollbar)_transparent] [scrollbar-width:thin] max-[1200px]:px-6 max-[960px]:overflow-auto [@media(max-height:700px)]:overflow-auto max-[760px]:gap-[17px] max-[760px]:px-1 max-[760px]:py-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-[var(--focus)] [&_button:focus-visible]:outline-offset-[3px] [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-[var(--focus)] [&_a:focus-visible]:outline-offset-[3px] [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-[var(--focus)] [&_input:focus-visible]:outline-offset-[3px]"
      aria-labelledby="home-heading"
    >
      <h1 id="home-heading" className="sr-only">Головна</h1>

      <div className="grid min-h-0 shrink-0 items-stretch grid-cols-[minmax(0,1.535fr)_minmax(0,1fr)] gap-[clamp(12px,2.5vw,36px)] max-[1200px]:gap-5 max-[760px]:grid-cols-1 max-[760px]:gap-3">
        <div className="min-w-0">
          {(!featured.lesson || featured.state === 'none') && (
            <div className="pointer-events-none absolute top-[clamp(-100px,calc(1vh-60px),180px)] right-[calc(var(--app-main-left)+37vw)] z-[60] hidden min-[1200px]:block">
              <CheshireCat pose="lying" height={120} />
            </div>
          )}
          <NextLessonCard lesson={featured.lesson} state={featured.state} />
        </div>
        <FocusCard
          date={date}
          lessons={lessons}
          deadlines={deadlines}
          activeTaskCount={summary?.activeTasks ?? activeTaskCount}
          deadlinesNext3Days={summary?.deadlinesNext3Days ?? deadlines.length}
          overdueTasks={summary?.overdueTasks ?? 0}
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
