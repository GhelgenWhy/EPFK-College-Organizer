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
    <main className="home-page" aria-labelledby="home-heading">
      <div className="home-page__heading">
        <div>
          <h1 id="home-heading">
            {formatDate(HOME_DEMO_DATE, { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </h1>
          <p className="home-page__date">{weekday}</p>
        </div>
        <button
          className="home-calendar-button"
          onClick={() => onOpenCalendar(HOME_DEMO_DATE)}
          type="button"
        >
          Відкрити календар
        </button>
      </div>

      <div className="home-hero-grid">
        <NextLessonCard lesson={HOME_LESSONS[1]} />
        <FocusCard activeTaskCount={activeTaskCount} onOpenCalendar={onOpenCalendar} onOpenSchedule={onOpenSchedule} />
      </div>

      <div className="home-dashboard-grid">
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
    <section className="home-panel next-lesson" aria-labelledby="next-lesson-heading">
      <div className="next-lesson__copy">
        <span className="next-lesson__badge">Наступна пара</span>
        <p className="next-lesson__time">{lesson.startsAt} – {lesson.endsAt}</p>
        <h2 id="next-lesson-heading">{lesson.title}</h2>
        <p className="next-lesson__meta">{lesson.teacher} <span aria-hidden="true">·</span> онлайн-заняття</p>
      </div>
      {lesson.meetingUrl && (
        <a className="meet-button" href={lesson.meetingUrl} target="_blank" rel="noreferrer">
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
    <section className="home-panel focus-card" aria-labelledby="focus-heading">
      <h2 id="focus-heading">Аджента</h2>
      <p>«те, що має бути зроблено» або «справа, яку слід виконати»</p>
      <div className="focus-card__metrics">
        {metrics.map((metric) => (
          <button
            className={`focus-metric ${metric.urgent ? 'focus-metric--urgent' : ''}`}
            key={metric.label}
            onClick={metric.action}
            type="button"
          >
            <span className="focus-metric__value">{metric.value}</span>
            <span className="focus-metric__label">{metric.label}</span>
            <span className="focus-metric__detail">{metric.detail}</span>
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
    <div className="home-section-heading">
      <div>
        <h2 id={id}>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button className="home-text-action" onClick={action.onClick} type="button">
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
    <section className="home-panel home-section schedule-section" aria-labelledby="today-schedule-heading">
      <SectionHeading
        id="today-schedule-heading"
        title="Розклад на сьогодні"
        subtitle={`${titleCase(formatDate(HOME_DEMO_DATE, { weekday: 'long' }))} · ${lessons.length} пари`}
      />
      <ol className="lesson-list">
        {lessons.map((lesson, index) => (
          <li className={`lesson-row ${index === 1 ? 'lesson-row--next' : ''}`} key={lesson.id}>
            <time className="lesson-row__time" dateTime={lesson.startsAt}>
              <span>{lesson.startsAt}</span>
              <span>{lesson.endsAt}</span>
            </time>
            <div className="lesson-row__body">
              <h3>{lesson.title}</h3>
              <p>{index === 1 ? 'Онлайн · Google Meet' : lesson.location}</p>
            </div>
            {index === 0
              ? <span className="lesson-status lesson-status--done">Завершено</span>
              : index === 1
                ? <span className="lesson-status lesson-status--next">Наступна</span>
                : <span className="lesson-status lesson-status--later">Пізніше</span>}
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
    <section className="home-panel home-section deadlines-section" aria-labelledby="deadlines-heading">
      <SectionHeading id="deadlines-heading" title="Найближчі дедлайни" subtitle="Спочатку найтерміновіші" />
      <ul className="deadline-list">
        {HOME_DEADLINES.map((deadline) => (
          <li key={deadline.id}>
            <button
              className={`deadline-item ${deadline.urgent ? 'deadline-item--urgent' : ''}`}
              type="button"
              onClick={() => onOpenCalendar(parseLocalDate(deadline.date), 'DEADLINES_ONLY')}
            >
              <span className="deadline-item__date">{deadline.label}</span>
              <span className="deadline-item__title">{deadline.title}</span>
              <span className="deadline-item__course">{deadline.course}</span>
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
    <section className="home-panel home-section tasks-section" aria-labelledby="my-tasks-heading">
      <SectionHeading
        id="my-tasks-heading"
        title="Мої завдання"
        subtitle={`${HOME_TASKS.length - completedCount} активні · ${completedCount + 1} виконане цього тижня`}
      />
      <ul className="task-list">
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
    <li className={`task-row ${completed ? 'task-row--completed' : ''}`}>
      <label className="task-row__label">
        <input aria-label={`Позначити завдання «${task.title}» як виконане`} checked={completed} onChange={onToggle} type="checkbox" />
        <span className="task-row__copy">
          <span className="task-row__title">{task.title}</span>
          <span className="task-row__course">{task.course}</span>
          <time className="task-row__date" dateTime={task.dueDate}>
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
    <section className="home-panel events-section" aria-labelledby="events-heading">
      <div className="events-section__intro">
        <h2 id="events-heading">Події коледжу</h2>
        <button
          className="home-text-action"
          onClick={() => onOpenCalendar(parseLocalDate(HOME_EVENTS[0].date), 'EVENTS_ONLY')}
          type="button"
        >
          Переглянути всі <span aria-hidden="true">→</span>
        </button>
      </div>
      <ul className="event-list">
        {HOME_EVENTS.map((event) => (
          <EventRow key={event.id} event={event} onClick={() => onOpenCalendar(parseLocalDate(event.date), 'EVENTS_ONLY')} />
        ))}
      </ul>
    </section>
  );
}

function EventRow({ event, onClick }: { event: CollegeEvent; onClick: () => void }) {
  return (
    <li>
      <button className="event-row" onClick={onClick} type="button">
        <time className="event-row__date" dateTime={event.date}>
          {formatDate(parseLocalDate(event.date), { day: 'numeric' })} {event.monthLabel}
        </time>
        <span className="event-row__copy">
          <span className="event-row__title">{event.title}</span>
          <span className="event-row__details">{event.details}</span>
        </span>
      </button>
    </li>
  );
}
