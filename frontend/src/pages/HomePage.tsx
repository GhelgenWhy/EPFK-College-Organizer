import type { CalendarFilterType } from '../features/calendar/types';
import { useTaskCompletion } from '../features/tasks/hooks/useTaskCompletion';
import { organizerApi } from '../services/api/organizer';
import { useApiQuery } from '../services/api/useApiQuery';
import { ApiQueryStatus } from '../components/ApiQueryStatus';
import type { CollegeEvent, HomeworkTask, HomeLesson, HomeDeadline, HomeData } from '../features/home/types';
import { NextLessonCard } from '../components/home/NextLessonCard';

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', ...options }).format(date);
}

function parseLocalDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function titleCase(value: string) {
  return `${value.slice(0, 1).toLocaleUpperCase('uk-UA')}${value.slice(1)}`;
}

interface HomePageProps {
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
  onOpenSchedule: () => void;
}

export function HomePage(props: HomePageProps) {
  const query = useApiQuery(organizerApi.getHome);
  if (!query.data) return (
    <main className="min-h-0 flex-1 overflow-auto p-6">
      <h1 className="mb-5 text-3xl font-bold text-primary">Головна</h1>
      <ApiQueryStatus query={query} />
    </main>
  );
  return <HomeContent key={query.userId} {...props} data={query.data} storageKey={`epfk-organizer:${query.userId}:home-completed-tasks`} />;
}

function HomeContent({ onOpenCalendar, onOpenSchedule, data, storageKey }: HomePageProps & { data: HomeData; storageKey: string }) {
  const { date, deadlines, events, lessons, tasks } = data;
  const { completedTaskIds, toggleTask } = useTaskCompletion(tasks, storageKey);
  const completedTaskCount = tasks.filter((task) => completedTaskIds.includes(task.id)).length;
  const activeTaskCount = tasks.length - completedTaskCount;
  const weekday = titleCase(formatDate(date, { weekday: 'long' }));

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-[clamp(8px,1.4vh,14px)] overflow-hidden px-[18px] py-[clamp(12px,2vh,20px)] pr-5 [scrollbar-color:var(--scrollbar)_transparent] [scrollbar-width:thin] max-[1200px]:px-6 max-[960px]:overflow-auto [@media(max-height:700px)]:overflow-auto max-[760px]:gap-[17px] max-[760px]:px-1 max-[760px]:py-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-[var(--focus)] [&_button:focus-visible]:outline-offset-[3px] [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-[var(--focus)] [&_a:focus-visible]:outline-offset-[3px] [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-[var(--focus)] [&_input:focus-visible]:outline-offset-[3px]" aria-labelledby="home-heading">
      <div className="flex min-h-[clamp(48px,7vh,64px)] shrink-0 items-center justify-between gap-5 max-[760px]:min-h-[62px]">
        <div>
          <h1 id="home-heading" className="text-[clamp(30px,1.8vw,34px)] font-bold leading-[1.15] tracking-[-0.045em] text-primary max-[760px]:text-[30px]">
            {formatDate(date, { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </h1>
          <p className="mt-[7px] text-[15px] text-secondary max-[760px]:mt-[3px] max-[760px]:text-[13px]">{weekday}</p>
        </div>
        <button
          className="mr-[47px] inline-flex min-h-[46px] min-w-[232px] items-center justify-center rounded-xl border border-[var(--border)] bg-surface px-5 text-[13px] font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent-soft)] hover:bg-[var(--surface-hover)] max-[1200px]:mr-0 max-[760px]:min-h-10 max-[760px]:min-w-0 max-[760px]:px-[11px] max-[760px]:text-[11px]"
          onClick={() => onOpenCalendar(date)}
          type="button"
        >
          Відкрити календар
        </button>
      </div>

      <div className="grid min-h-0 shrink-0 items-stretch grid-cols-[minmax(0,1.535fr)_minmax(0,1fr)] gap-[clamp(12px,2.5vw,36px)] max-[1200px]:gap-5 max-[760px]:grid-cols-1 max-[760px]:gap-3">
        {(lessons[1] ?? lessons[0]) ? <NextLessonCard lesson={lessons[1] ?? lessons[0]} /> : <p className="rounded-[19px] bg-surface p-4 text-secondary">Сьогодні пар немає.</p>}
        <FocusCard date={date} lessons={lessons} deadlines={deadlines} activeTaskCount={activeTaskCount} onOpenCalendar={onOpenCalendar} onOpenSchedule={onOpenSchedule} />
      </div>

      <div className="grid min-h-0 flex-1 items-stretch grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-[clamp(10px,1.4vw,20px)] gap-y-[clamp(8px,1.4vh,14px)] max-[960px]:flex-none max-[960px]:grid-cols-2 max-[960px]:gap-[18px] [@media(max-height:700px)]:min-h-[420px] [@media(max-height:700px)]:flex-none max-[760px]:grid-cols-1 max-[760px]:gap-3">
        <ScheduleSection lessons={lessons} date={date} />
        <DeadlinesSection deadlines={deadlines} onOpenCalendar={onOpenCalendar} />
        <TasksSection
          tasks={tasks}
          completedTaskIds={completedTaskIds}
          onToggleTask={toggleTask}
        />
      </div>

      <EventsSection events={events} date={date} onOpenCalendar={onOpenCalendar} />
    </main>
  );
}

function FocusCard({ date, lessons, deadlines, activeTaskCount, onOpenCalendar, onOpenSchedule }: {
  date: Date;
  lessons: HomeLesson[];
  deadlines: HomeDeadline[];
  activeTaskCount: number;
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
  onOpenSchedule: () => void;
}) {
  const dateKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' }).format(date);
  const urgentDeadlines = deadlines.filter((deadline) => deadline.urgent || deadline.date === dateKey);
  const metrics = [
    { value: lessons.length, label: 'пари', detail: 'Сьогодні в розкладі', action: onOpenSchedule },
    { value: urgentDeadlines.length, label: 'дедлайни', detail: 'Потребують уваги', action: () => onOpenCalendar(deadlines[0] ? parseLocalDate(deadlines[0].date) : date, 'DEADLINES_ONLY'), urgent: true },
    { value: activeTaskCount, label: 'завдання', detail: 'Ще не завершені', action: () => onOpenCalendar(date, 'DEADLINES_ONLY') },
  ];

  return (
    <section className="flex min-h-[clamp(150px,20vh,180px)] min-w-0 flex-col justify-center rounded-[19px] bg-surface px-4 py-3 max-[760px]:col-start-1 max-[760px]:min-h-[190px] max-[760px]:p-[17px]" aria-labelledby="focus-heading">
      <h2 id="focus-heading" className="text-lg font-bold tracking-[-0.025em] text-primary max-[760px]:text-xl">Аджента</h2>
      <p className="mt-1 text-[11px] leading-[1.35] text-[var(--text-muted)] max-[760px]:text-[11px]">«те, що має бути зроблено» або «справа, яку слід виконати»</p>
      <div className="mt-2 grid grid-cols-3 gap-[6px]">
        {metrics.map((metric) => (
          <button
            className={`grid min-h-[66px] min-w-0 grid-cols-[auto_1fr] content-center items-baseline justify-start gap-x-[6px] rounded-[13px] border-0 p-[7px] text-left text-primary transition-[filter] hover:brightness-[0.97] max-[1200px]:grid-cols-1 max-[760px]:min-h-[82px] max-[760px]:grid-cols-[auto_1fr] max-[760px]:p-[8px_7px] ${metric.urgent ? 'bg-[var(--danger-soft)]' : 'bg-[var(--surface-muted)]'}`}
            key={metric.label}
            onClick={metric.action}
            type="button"
          >
            <span className="text-[22px] leading-none font-bold tracking-[-0.04em] tabular-nums max-[1200px]:text-xl max-[760px]:text-[21px]">{metric.value}</span>
            <span className="min-w-0 whitespace-nowrap text-xs font-bold max-[1200px]:text-[11px] max-[760px]:text-[11px]">{metric.label}</span>
            <span className="col-span-full mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-[var(--text-muted)] max-[760px]:mt-[10px] max-[760px]:text-[8px]">{metric.detail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ id, title, subtitle, action }: {
  id: string;
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-2 border-b border-[var(--border)] pb-[11px]">
      <div>
        <h2 id={id} className="text-[21px] leading-[1.25] font-bold tracking-[-0.025em] text-primary max-[760px]:text-base">{title}</h2>
        <p className="mt-[6px] text-xs text-[var(--text-muted)] max-[760px]:text-[10px]">{subtitle}</p>
      </div>
      {action && (
        <button className="inline-flex shrink-0 items-center gap-[6px] border-0 bg-transparent py-1 text-xs font-bold text-[var(--accent)] hover:underline hover:underline-offset-[3px] max-[760px]:text-[10px]" onClick={action.onClick} type="button">
          {action.label} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

function ScheduleSection({ lessons, date }: {
  lessons: HomeLesson[];
  date: Date;
}) {
  return (
    <section className="col-start-1 flex min-h-0 min-w-0 flex-col rounded-[19px] bg-surface p-3 max-[960px]:col-span-full max-[760px]:col-span-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]" aria-labelledby="today-schedule-heading">
      <SectionHeading
        id="today-schedule-heading"
        title="Розклад на сьогодні"
        subtitle={`${titleCase(formatDate(date, { weekday: 'long' }))} · ${lessons.length} пари`}
      />
      <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
        {lessons.map((lesson, index) => (
          <li className={`relative grid min-h-0 flex-1 grid-cols-[92px_minmax(0,1fr)_118px] items-center gap-2 border-b border-[var(--border)] px-2 py-1 last:border-b-0 max-[1200px]:grid-cols-[66px_minmax(0,1fr)_74px] max-[760px]:min-h-[75px] max-[760px]:grid-cols-[64px_minmax(0,1fr)_78px] max-[760px]:gap-2 max-[760px]:px-1 max-[760px]:py-[6px] ${index === 1 ? 'my-1 rounded-[13px] border-0 bg-[var(--accent-soft)] before:absolute before:top-[10px] before:bottom-[10px] before:left-[10px] before:w-1 before:rounded-[4px] before:bg-[var(--accent)] before:content-[\'\'] max-[760px]:pl-[14px] max-[760px]:pr-2' : ''}`} key={lesson.id}>
            <time className={`flex h-[46px] flex-col justify-center gap-1 border-r border-[var(--border)] text-sm leading-[1.1] font-bold tabular-nums text-primary max-[1200px]:text-[11px] max-[760px]:h-12 max-[760px]:text-xs ${index === 1 ? 'pl-3' : ''}`} dateTime={lesson.startsAt}>
              <span>{lesson.startsAt}</span>
              <span className="text-[11px] font-medium text-[var(--text-muted)] max-[1200px]:text-[9px] max-[760px]:text-[10px]">{lesson.endsAt}</span>
            </time>
            <div className="min-w-0">
              <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.4] font-bold text-primary max-[760px]:text-[11px]">{lesson.title}</h3>
              <p className="mt-[5px] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[var(--text-muted)] max-[760px]:text-[9px]">{index === 1 ? 'Онлайн · Google Meet' : lesson.location}</p>
            </div>
            {index === 0
              ? <span className="inline-flex min-h-[26px] min-w-[74px] justify-self-end items-center justify-center rounded-[9px] bg-[var(--surface-muted)] px-2 text-[10px] font-semibold whitespace-nowrap text-[var(--text-muted)] max-[1200px]:min-w-0 max-[1200px]:text-[8px] max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">Завершено</span>
              : index === 1
                ? <span className="inline-flex min-h-[26px] min-w-[74px] justify-self-end items-center justify-center rounded-[9px] bg-[var(--success-soft)] px-2 text-[10px] font-semibold whitespace-nowrap text-[var(--accent-hover)] max-[1200px]:min-w-0 max-[1200px]:text-[8px] max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">Наступна</span>
                : <span className="inline-flex min-h-[26px] min-w-[74px] justify-self-end items-center justify-center rounded-[9px] bg-[var(--surface-muted)] px-2 text-[10px] font-semibold whitespace-nowrap text-[var(--text-muted)] max-[1200px]:min-w-0 max-[1200px]:text-[8px] max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">Пізніше</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function DeadlinesSection({ deadlines, onOpenCalendar }: {
  deadlines: HomeDeadline[];
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
}) {
  return (
    <section className="flex min-h-0 min-w-0 flex-col rounded-[19px] bg-surface p-3 max-[760px]:col-start-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]" aria-labelledby="deadlines-heading">
      <SectionHeading id="deadlines-heading" title="Найближчі дедлайни" subtitle="Спочатку найтерміновіші" />
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-2 p-0 pt-2">
        {deadlines.map((deadline, index) => (
          <li className="min-h-0 flex-1" key={deadline.id}>
            <button
              className={`flex h-full min-h-0 w-full flex-col items-start rounded-xl border px-3 py-2 text-left text-inherit transition-colors hover:border-[var(--accent-hover)] max-[760px]:min-h-[94px] max-[760px]:px-[11px] ${deadline.urgent ? 'border-[var(--danger)] bg-[var(--danger-soft)]' : 'border-[var(--border)] bg-surface'}`}
              type="button"
              onClick={() => onOpenCalendar(parseLocalDate(deadline.date), 'DEADLINES_ONLY')}
            >
              <span className={`inline-flex min-h-[25px] min-w-[140px] items-center rounded-lg px-[10px] text-[10px] font-bold max-[760px]:min-h-[27px] max-[760px]:text-[10px] ${index === 1 ? 'bg-[var(--warning-soft)] text-[var(--warning)]' : deadline.urgent ? 'bg-[var(--danger)] text-on-accent' : 'bg-[var(--accent-soft)] text-[var(--accent)]'}`}>{deadline.label}</span>
              <span className="mt-1 line-clamp-1 text-xs leading-[1.25] font-bold text-primary max-[760px]:text-xs" title={deadline.title}>{deadline.title}</span>
              <span className="mt-1 text-[10px] text-[var(--text-muted)] max-[760px]:mt-1 max-[760px]:text-[10px]">{deadline.course}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TasksSection({ tasks, completedTaskIds, onToggleTask }: {
  tasks: HomeworkTask[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}) {
  const completedCount = tasks.filter((task) => completedTaskIds.includes(task.id)).length;

  return (
    <section className="flex min-h-0 min-w-0 flex-col rounded-[19px] bg-surface p-3 max-[760px]:col-start-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]" aria-labelledby="my-tasks-heading">
      <SectionHeading
        id="my-tasks-heading"
        title="Мої завдання"
        subtitle={`${tasks.length - completedCount} активні · ${completedCount} виконане цього тижня`}
      />
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col p-0 pt-0.5">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            completed={completedTaskIds.includes(task.id)}
            onToggle={() => onToggleTask(task.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function TaskRow({ task, completed, onToggle }: {
  task: HomeworkTask;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex min-h-0 min-w-0 flex-1 items-center border-b border-[var(--border)] last:border-b-0 max-[760px]:min-h-[88px]">
      <label className="flex min-w-0 cursor-pointer items-start gap-[10px] max-[760px]:gap-3">
        <input className="mt-px h-6 w-6 shrink-0 appearance-none rounded-full border-2 border-[var(--accent)] bg-surface checked:border-[var(--accent)] checked:bg-[var(--accent)] checked:shadow-[inset_0_0_0_5px_var(--surface)] focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:h-[22px] max-[760px]:w-[22px]" aria-label={`Позначити завдання «${task.title}» як виконане`} checked={completed} onChange={onToggle} type="checkbox" />
        <span className="flex min-w-0 flex-col items-start">
          <span className={`max-w-full overflow-hidden text-ellipsis text-[15px] leading-[1.45] font-bold text-primary max-[760px]:text-xs ${completed ? 'text-[var(--text-muted)] line-through decoration-[var(--text-muted)]' : ''}`}>{task.title}</span>
          <span className="mt-[6px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[var(--text-muted)]">{task.course}</span>
          <time className="mt-2 text-xs font-semibold text-[var(--accent)] max-[760px]:text-[10px]" dateTime={task.dueDate}>
            До {formatDate(parseLocalDate(task.dueDate), { day: 'numeric', month: 'long' })}
          </time>
        </span>
      </label>
    </li>
  );
}

function EventsSection({ events, date, onOpenCalendar }: {
  events: CollegeEvent[];
  date: Date;
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
}) {
  return (
    <section className="grid min-h-[62px] shrink-0 grid-cols-[minmax(217px,0.44fr)_2fr] items-stretch rounded-[19px] bg-surface py-1 pr-3 max-[760px]:grid-cols-1 max-[760px]:py-0 max-[760px]:pr-3 max-[760px]:pb-[10px]" aria-labelledby="events-heading">
      <div className="relative flex min-h-0 flex-col justify-center border-r border-[var(--border)] py-[6px] pr-[19px] pl-6 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[5px] before:rounded-r-[5px] before:bg-[var(--accent)] before:content-[''] max-[760px]:min-h-[68px] max-[760px]:border-r-0 max-[760px]:border-b">
        <h2 id="events-heading" className="text-lg font-bold text-primary max-[760px]:text-base">Події коледжу</h2>
        <button
          className="mt-2 inline-flex shrink-0 items-center gap-[6px] self-start border-0 bg-transparent py-1 text-xs font-bold text-[var(--accent)] hover:underline hover:underline-offset-[3px] max-[760px]:mt-[3px] max-[760px]:text-[10px]"
          onClick={() => onOpenCalendar((events[0] ? parseLocalDate(events[0].date) : date), 'EVENTS_ONLY')}
          type="button"
        >
          Переглянути всі <span aria-hidden="true">→</span>
        </button>
      </div>
      <ul className="m-0 grid list-none grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] p-0 max-[760px]:grid-cols-1">
        {events.map((event) => (
          <EventRow key={event.id} event={event} onClick={() => onOpenCalendar(parseLocalDate(event.date), 'EVENTS_ONLY')} />
        ))}
      </ul>
    </section>
  );
}

function EventRow({ event, onClick }: { event: CollegeEvent; onClick: () => void }) {
  return (
    <li className="max-[760px]:first:border-t-0 max-[760px]:[&+li]:border-t max-[760px]:[&+li]:border-[var(--border)] max-[760px]:[&+li]:border-l-0 [&+li]:border-l [&+li]:border-[var(--border)]">
      <button className="flex min-h-[54px] w-full items-center gap-[10px] border-0 bg-transparent px-3 py-1 text-left text-inherit max-[760px]:min-h-[60px] max-[760px]:gap-[10px] max-[760px]:px-3 max-[760px]:py-2" onClick={onClick} type="button">
        <time className="inline-flex min-h-7 min-w-[69px] items-center justify-center whitespace-nowrap rounded-lg bg-[var(--accent-soft)] px-2 text-[11px] font-bold text-[var(--accent)] max-[760px]:min-h-[27px] max-[760px]:min-w-[68px] max-[760px]:text-[10px]" dateTime={event.date}>
          {formatDate(parseLocalDate(event.date), { day: 'numeric' })} {event.monthLabel}
        </time>
        <span className="flex min-w-0 flex-col items-start">
          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.4] font-bold text-primary max-[760px]:text-[11px]">{event.title}</span>
          <span className="mt-1 text-[10px] text-[var(--text-muted)] max-[760px]:mt-1 max-[760px]:text-[10px]">{event.details}</span>
        </span>
      </button>
    </li>
  );
}
