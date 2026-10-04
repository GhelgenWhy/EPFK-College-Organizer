import type { CalendarFilterType } from '../../calendar/types';
import { useTaskCompletion } from '../../tasks/hooks/useTaskCompletion';
import { HOME_DEMO_DATE, HOME_DEADLINES, HOME_EVENTS, HOME_LESSONS, HOME_TASKS } from '../mockData';
import type { CollegeEvent, HomeworkTask, HomeLesson } from '../types';

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('uk-UA', options).format(date);
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

export function HomePage({ onOpenCalendar, onOpenSchedule }: HomePageProps) {
  const { completedTaskIds, toggleTask } = useTaskCompletion(HOME_TASKS, 'epfk-organizer:home-completed-tasks');
  const completedTaskCount = HOME_TASKS.filter((task) => completedTaskIds.includes(task.id)).length;
  const activeTaskCount = HOME_TASKS.length - completedTaskCount;
  const weekday = titleCase(formatDate(HOME_DEMO_DATE, { weekday: 'long' }));

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-[25px] overflow-auto px-[18px] pt-[37px] pr-5 pb-6 [scrollbar-color:#c4d8d4_transparent] [scrollbar-width:thin] max-[1200px]:px-6 max-[760px]:gap-[17px] max-[760px]:px-1 max-[760px]:py-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-[#0b8580] [&_button:focus-visible]:outline-offset-[3px] [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-[#0b8580] [&_a:focus-visible]:outline-offset-[3px] [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-[#0b8580] [&_input:focus-visible]:outline-offset-[3px]" aria-labelledby="home-heading">
      <div className="flex min-h-[74px] items-center justify-between gap-5 max-[760px]:min-h-[62px]">
        <div>
          <h1 id="home-heading" className="text-[clamp(30px,1.8vw,34px)] font-bold leading-[1.15] tracking-[-0.045em] text-primary max-[760px]:text-[30px]">
            {formatDate(HOME_DEMO_DATE, { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </h1>
          <p className="mt-[7px] text-[15px] text-secondary max-[760px]:mt-[3px] max-[760px]:text-[13px]">{weekday}</p>
        </div>
        <button
          className="mr-[47px] inline-flex min-h-[46px] min-w-[232px] items-center justify-center rounded-xl border border-[#dfecea] bg-white px-5 text-[13px] font-semibold text-[#079b98] transition-colors hover:border-[#9dcfc9] hover:bg-[#f9fdfc] max-[1200px]:mr-0 max-[760px]:min-h-10 max-[760px]:min-w-0 max-[760px]:px-[11px] max-[760px]:text-[11px]"
          onClick={() => onOpenCalendar(HOME_DEMO_DATE)}
          type="button"
        >
          Відкрити календар
        </button>
      </div>

      <div className="grid items-start grid-cols-[minmax(0,1.535fr)_minmax(0,1fr)] gap-[clamp(24px,4.55vw,94px)] max-[1200px]:gap-5 max-[760px]:grid-cols-1 max-[760px]:gap-3">
        <NextLessonCard lesson={HOME_LESSONS[1]} />
        <FocusCard activeTaskCount={activeTaskCount} onOpenCalendar={onOpenCalendar} onOpenSchedule={onOpenSchedule} />
      </div>

      <div className="mt-[2px] grid items-stretch grid-cols-[minmax(0,1.53fr)_minmax(0,0.96fr)_minmax(0,1fr)] gap-x-[clamp(22px,2.5vw,48px)] gap-y-[25px] max-[1200px]:grid-cols-2 max-[1200px]:gap-[18px] max-[760px]:grid-cols-1 max-[760px]:gap-3">
        <ScheduleSection lessons={HOME_LESSONS} />
        <DeadlinesSection onOpenCalendar={onOpenCalendar} />
        <TasksSection
          completedTaskIds={completedTaskIds}
          onToggleTask={toggleTask}
        />
      </div>

      <EventsSection onOpenCalendar={onOpenCalendar} />
    </main>
  );
}

function NextLessonCard({ lesson }: { lesson: HomeLesson }) {
  return (
    <section className="relative flex min-h-[192px] items-center overflow-hidden rounded-[19px] bg-[#079b98] p-[22px_21px] text-white max-[760px]:col-start-1 max-[760px]:min-h-[208px] max-[760px]:p-[17px]" aria-labelledby="next-lesson-heading">
      <div className="min-w-0 pr-[263px] max-[1200px]:pr-[215px] max-[760px]:self-start max-[760px]:pr-0">
        <span className="inline-flex min-h-7 items-center rounded-lg bg-[#d9f4f1] px-3 text-[11px] font-bold uppercase text-[#078d89] max-[760px]:min-h-[26px] max-[760px]:text-[10px]">Наступна пара</span>
        <p className="mt-[11px] text-[clamp(25px,1.8vw,34px)] leading-[1.08] font-bold tracking-[-0.035em] tabular-nums text-white max-[760px]:mt-[9px] max-[760px]:text-[26px]">{lesson.startsAt} – {lesson.endsAt}</p>
        <h2 id="next-lesson-heading" className="mt-[13px] text-[clamp(18px,1.25vw,24px)] leading-[1.25] font-bold tracking-[-0.025em] text-white max-[760px]:mt-2 max-[760px]:max-w-full max-[760px]:text-lg">{lesson.title}</h2>
        <p className="mt-[7px] text-sm leading-[1.4] text-[#d0f1ed] max-[760px]:mt-[5px] max-[760px]:text-xs">{lesson.teacher} <span className="px-1" aria-hidden="true">·</span> онлайн-заняття</p>
      </div>
      {lesson.meetingUrl && (
        <a className="absolute right-[21px] bottom-[21px] inline-flex min-h-[42px] min-w-[243px] items-center justify-center gap-[9px] rounded-[11px] bg-white px-4 text-[13px] font-bold text-[#078d89] no-underline transition-transform hover:-translate-y-px hover:bg-[#eaf8f6] max-[1200px]:right-4 max-[1200px]:min-w-[195px] max-[1200px]:text-xs max-[760px]:right-4 max-[760px]:bottom-[13px] max-[760px]:min-h-9 max-[760px]:min-w-0 max-[760px]:text-[11px]" href={lesson.meetingUrl} target="_blank" rel="noreferrer">
          Приєднатися до Meet <span aria-hidden="true">→</span>
        </a>
      )}
    </section>
  );
}

function FocusCard({ activeTaskCount, onOpenCalendar, onOpenSchedule }: {
  activeTaskCount: number;
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
  onOpenSchedule: () => void;
}) {
  const metrics = [
    { value: HOME_LESSONS.length, label: 'пари', detail: 'Сьогодні в розкладі', action: onOpenSchedule },
    { value: 2, label: 'дедлайни', detail: 'Потребують уваги', action: () => onOpenCalendar(parseLocalDate(HOME_DEADLINES[0].date), 'DEADLINES_ONLY'), urgent: true },
    { value: activeTaskCount, label: 'завдання', detail: 'Ще не завершені', action: () => onOpenCalendar(HOME_DEMO_DATE, 'DEADLINES_ONLY') },
  ];

  return (
    <section className="flex min-h-[190px] flex-col justify-center rounded-[19px] bg-white px-[23px] pt-[19px] pb-[18px] max-[1200px]:px-4 max-[760px]:col-start-1 max-[760px]:min-h-[190px] max-[760px]:p-[17px]" aria-labelledby="focus-heading">
      <h2 id="focus-heading" className="text-[21px] font-bold tracking-[-0.025em] text-primary max-[760px]:text-xl">Аджента</h2>
      <p className="mt-1 text-[13px] leading-[1.35] text-[#80939c] max-[760px]:text-[11px]">«те, що має бути зроблено» або «справа, яку слід виконати»</p>
      <div className="mt-[13px] grid grid-cols-3 gap-[10px] max-[1200px]:gap-[7px] max-[760px]:mt-3">
        {metrics.map((metric) => (
          <button
            className={`grid min-h-[93px] min-w-0 grid-cols-[auto_1fr] content-center items-baseline justify-start gap-x-[6px] rounded-[13px] border-0 bg-[#edf7f5] p-[10px_11px] text-left text-primary transition-[filter] hover:brightness-[0.97] max-[1200px]:min-h-[91px] max-[1200px]:grid-cols-1 max-[1200px]:p-2 max-[760px]:min-h-[82px] max-[760px]:grid-cols-[auto_1fr] max-[760px]:p-[8px_7px] ${metric.urgent ? 'bg-[#fbdede]' : ''}`}
            key={metric.label}
            onClick={metric.action}
            type="button"
          >
            <span className="text-[28px] leading-none font-bold tracking-[-0.04em] tabular-nums max-[1200px]:text-2xl max-[760px]:text-[21px]">{metric.value}</span>
            <span className="min-w-0 whitespace-nowrap text-[17px] font-bold max-[1200px]:text-sm max-[760px]:text-[11px]">{metric.label}</span>
            <span className="col-span-full mt-[15px] overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#82959e] max-[760px]:mt-[10px] max-[760px]:text-[8px]">{metric.detail}</span>
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
    <div className="flex min-w-0 items-start justify-between gap-2 border-b border-[#dfeae8] pb-[11px]">
      <div>
        <h2 id={id} className="text-[21px] leading-[1.25] font-bold tracking-[-0.025em] text-primary max-[760px]:text-base">{title}</h2>
        <p className="mt-[6px] text-xs text-[#83969e] max-[760px]:text-[10px]">{subtitle}</p>
      </div>
      {action && (
        <button className="inline-flex shrink-0 items-center gap-[6px] border-0 bg-transparent py-1 text-xs font-bold text-[#079b98] hover:underline hover:underline-offset-[3px] max-[760px]:text-[10px]" onClick={action.onClick} type="button">
          {action.label} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

function ScheduleSection({ lessons }: {
  lessons: HomeLesson[];
}) {
  return (
    <section className="col-start-1 min-h-[428px] min-w-0 self-start rounded-[19px] bg-white px-[23px] pt-[23px] pb-[15px] max-[1200px]:col-span-full max-[1200px]:min-h-[420px] max-[1200px]:px-[18px] max-[760px]:col-span-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]" aria-labelledby="today-schedule-heading">
      <SectionHeading
        id="today-schedule-heading"
        title="Розклад на сьогодні"
        subtitle={`${titleCase(formatDate(HOME_DEMO_DATE, { weekday: 'long' }))} · ${lessons.length} пари`}
      />
      <ol className="m-0 list-none p-0">
        {lessons.map((lesson, index) => (
          <li className={`relative grid min-h-[81px] grid-cols-[92px_minmax(0,1fr)_118px] items-center gap-[11px] border-b border-[#dfeae8] px-3 py-[7px] last:border-b-0 max-[1200px]:grid-cols-[100px_minmax(0,1fr)_110px] max-[760px]:min-h-[75px] max-[760px]:grid-cols-[64px_minmax(0,1fr)_78px] max-[760px]:gap-2 max-[760px]:px-1 max-[760px]:py-[6px] ${index === 1 ? 'my-1 min-h-[79px] rounded-[13px] border-0 bg-[#e4f4f1] before:absolute before:top-[10px] before:bottom-[10px] before:left-[10px] before:w-1 before:rounded-[4px] before:bg-[#079b98] before:content-[\'\'] max-[760px]:pl-[14px] max-[760px]:pr-2' : ''}`} key={lesson.id}>
            <time className={`flex h-[54px] flex-col justify-center gap-1 border-r border-[#dfeae8] text-base leading-[1.1] font-bold tabular-nums text-primary max-[760px]:h-12 max-[760px]:text-xs ${index === 1 ? 'pl-3' : ''}`} dateTime={lesson.startsAt}>
              <span>{lesson.startsAt}</span>
              <span className="text-xs font-medium text-[#869ba3] max-[760px]:text-[10px]">{lesson.endsAt}</span>
            </time>
            <div className="min-w-0">
              <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.4] font-bold text-primary max-[760px]:text-[11px]">{lesson.title}</h3>
              <p className="mt-[5px] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[#82969f] max-[760px]:text-[9px]">{index === 1 ? 'Онлайн · Google Meet' : lesson.location}</p>
            </div>
            {index === 0
              ? <span className="inline-flex min-h-[29px] min-w-[108px] justify-self-end items-center justify-center rounded-[9px] bg-[#edf6f5] px-3 text-[11px] font-semibold whitespace-nowrap text-[#82969f] max-[760px]:min-w-0 max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">Завершено</span>
              : index === 1
                ? <span className="inline-flex min-h-[29px] min-w-[108px] justify-self-end items-center justify-center rounded-[9px] bg-[#ccefe9] px-3 text-[11px] font-semibold whitespace-nowrap text-[#078d89] max-[760px]:min-w-0 max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">Наступна</span>
                : <span className="inline-flex min-h-[29px] min-w-[108px] justify-self-end items-center justify-center rounded-[9px] bg-[#edf6f5] px-3 text-[11px] font-semibold whitespace-nowrap text-[#82969f] max-[760px]:min-w-0 max-[760px]:min-h-[26px] max-[760px]:px-[6px] max-[760px]:text-[9px]">Пізніше</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function DeadlinesSection({ onOpenCalendar }: {
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
}) {
  return (
    <section className="min-h-[433px] min-w-0 rounded-[19px] bg-white p-[23px_23px_17px] max-[1200px]:min-h-[420px] max-[1200px]:px-[18px] max-[760px]:col-start-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]" aria-labelledby="deadlines-heading">
      <SectionHeading id="deadlines-heading" title="Найближчі дедлайни" subtitle="Спочатку найтерміновіші" />
      <ul className="m-0 flex list-none flex-col gap-[9px] p-0 pt-[13px]">
        {HOME_DEADLINES.map((deadline, index) => (
          <li key={deadline.id}>
            <button
              className={`flex min-h-[98px] w-full flex-col items-start rounded-xl border border-[#dce9e6] bg-white px-[14px] py-[9px] text-left text-inherit transition-colors hover:border-[#96cfc7] max-[760px]:min-h-[94px] max-[760px]:px-[11px] ${deadline.urgent ? 'border-[#ff8e94] bg-[#fbd5d7]' : ''}`}
              type="button"
              onClick={() => onOpenCalendar(parseLocalDate(deadline.date), 'DEADLINES_ONLY')}
            >
              <span className={`inline-flex min-h-[29px] min-w-[162px] items-center rounded-lg px-[11px] text-xs font-bold max-[760px]:min-h-[27px] max-[760px]:text-[10px] ${deadline.urgent ? 'bg-[#ff7c80] text-white' : 'bg-[#e6f5f2] text-[#079b98]'} ${index === 1 ? 'bg-[#fff6dd] text-[#d99200]' : ''}`}>{deadline.label}</span>
              <span className="mt-[7px] text-sm leading-[1.3] font-bold text-primary max-[760px]:text-xs">{deadline.title}</span>
              <span className="mt-[6px] text-xs text-[#8498a0] max-[760px]:mt-1 max-[760px]:text-[10px]">{deadline.course}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TasksSection({ completedTaskIds, onToggleTask }: {
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}) {
  const completedCount = HOME_TASKS.filter((task) => completedTaskIds.includes(task.id)).length;

  return (
    <section className="min-h-[433px] min-w-0 rounded-[19px] bg-white p-[23px_23px_17px] max-[1200px]:min-h-[420px] max-[1200px]:px-[18px] max-[760px]:col-start-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]" aria-labelledby="my-tasks-heading">
      <SectionHeading
        id="my-tasks-heading"
        title="Мої завдання"
        subtitle={`${HOME_TASKS.length - completedCount} активні · ${completedCount + 1} виконане цього тижня`}
      />
      <ul className="m-0 list-none p-0 pt-0.5">
        {HOME_TASKS.map((task) => (
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
    <li className="flex min-w-0 min-h-[107px] items-center border-b border-[#dfeae8] last:border-b-0 max-[760px]:min-h-[88px]">
      <label className="flex min-w-0 cursor-pointer items-start gap-[15px] max-[760px]:gap-3">
        <input className="mt-px h-6 w-6 shrink-0 appearance-none rounded-full border-2 border-[#079b98] bg-white checked:border-[#079b98] checked:bg-[#079b98] checked:shadow-[inset_0_0_0_5px_#fff] focus-visible:outline-3 focus-visible:outline-[#0b8580] focus-visible:outline-offset-[3px] max-[760px]:h-[22px] max-[760px]:w-[22px]" aria-label={`Позначити завдання «${task.title}» як виконане`} checked={completed} onChange={onToggle} type="checkbox" />
        <span className="flex min-w-0 flex-col items-start">
          <span className={`max-w-full overflow-hidden text-ellipsis text-[15px] leading-[1.45] font-bold text-primary max-[760px]:text-xs ${completed ? 'text-[#82969f] line-through decoration-[#8aa29b]' : ''}`}>{task.title}</span>
          <span className="mt-[6px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#82969f]">{task.course}</span>
          <time className="mt-2 text-xs font-semibold text-[#079b98] max-[760px]:text-[10px]" dateTime={task.dueDate}>
            До {formatDate(parseLocalDate(task.dueDate), { day: 'numeric', month: 'long' })}
          </time>
        </span>
      </label>
    </li>
  );
}

function EventsSection({ onOpenCalendar }: {
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
}) {
  return (
    <section className="grid min-h-[91px] grid-cols-[minmax(217px,0.44fr)_2fr] items-stretch rounded-[19px] bg-white py-[9px] pr-[19px] max-[760px]:grid-cols-1 max-[760px]:py-0 max-[760px]:pr-3 max-[760px]:pb-[10px]" aria-labelledby="events-heading">
      <div className="relative flex min-h-0 flex-col justify-center border-r border-[#dfeae8] py-[6px] pr-[19px] pl-6 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[5px] before:rounded-r-[5px] before:bg-[#079b98] before:content-[''] max-[760px]:min-h-[68px] max-[760px]:border-r-0 max-[760px]:border-b">
        <h2 id="events-heading" className="text-lg font-bold text-primary max-[760px]:text-base">Події коледжу</h2>
        <button
          className="mt-2 inline-flex shrink-0 items-center gap-[6px] self-start border-0 bg-transparent py-1 text-xs font-bold text-[#079b98] hover:underline hover:underline-offset-[3px] max-[760px]:mt-[3px] max-[760px]:text-[10px]"
          onClick={() => onOpenCalendar(parseLocalDate(HOME_EVENTS[0].date), 'EVENTS_ONLY')}
          type="button"
        >
          Переглянути всі <span aria-hidden="true">→</span>
        </button>
      </div>
      <ul className="m-0 grid list-none grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] p-0 max-[760px]:grid-cols-1">
        {HOME_EVENTS.map((event) => (
          <EventRow key={event.id} event={event} onClick={() => onOpenCalendar(parseLocalDate(event.date), 'EVENTS_ONLY')} />
        ))}
      </ul>
    </section>
  );
}

function EventRow({ event, onClick }: { event: CollegeEvent; onClick: () => void }) {
  return (
    <li className="max-[760px]:first:border-t-0 max-[760px]:[&+li]:border-t max-[760px]:[&+li]:border-[#dfeae8] max-[760px]:[&+li]:border-l-0 [&+li]:border-l [&+li]:border-[#dfeae8]">
      <button className="flex min-h-[70px] w-full items-start gap-[15px] border-0 bg-transparent px-[19px] py-[5px] text-left text-inherit max-[760px]:min-h-[60px] max-[760px]:gap-[10px] max-[760px]:px-3 max-[760px]:py-2" onClick={onClick} type="button">
        <time className="inline-flex min-h-7 min-w-[69px] items-center justify-center whitespace-nowrap rounded-lg bg-[#e6f5f2] px-2 text-[11px] font-bold text-[#079b98] max-[760px]:min-h-[27px] max-[760px]:min-w-[68px] max-[760px]:text-[10px]" dateTime={event.date}>
          {formatDate(parseLocalDate(event.date), { day: 'numeric' })} {event.monthLabel}
        </time>
        <span className="flex min-w-0 flex-col items-start">
          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.4] font-bold text-primary max-[760px]:text-[11px]">{event.title}</span>
          <span className="mt-[10px] text-xs text-[#82969f] max-[760px]:mt-1 max-[760px]:text-[10px]">{event.details}</span>
        </span>
      </button>
    </li>
  );
}
