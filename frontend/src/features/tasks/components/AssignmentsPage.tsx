import { useMemo, useState } from 'react';
import { useTaskCompletion } from '../hooks/useTaskCompletion';
import { ASSIGNMENTS, ASSIGNMENTS_SNAPSHOT_DATE } from '../assignmentsData';
import type { Assignment } from '../types';
import './assignments.css';

type StatusFilter = 'ALL' | 'COMPLETED' | 'ACTIVE' | 'OVERDUE';
type SortOrder = 'SOONEST' | 'LATEST' | 'TITLE';

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'ALL', label: 'Всі' },
  { id: 'COMPLETED', label: 'Виконані' },
  { id: 'ACTIVE', label: 'Актуальні' },
  { id: 'OVERDUE', label: 'Прострочені' },
];

function parseLocalDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDueDate(date: string | null, dueTime?: string) {
  if (!date) return 'Без дедлайну';
  const formattedDate = new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parseLocalDate(date));
  return `${formattedDate}${dueTime ? `, ${dueTime}` : ''}`;
}

function isOverdue(task: Assignment, completed: boolean, today: Date) {
  return !completed && task.dueDate !== null && parseLocalDate(task.dueDate) < today;
}

function isDueToday(task: Assignment, today: Date) {
  if (!task.dueDate) return false;
  const dueDate = parseLocalDate(task.dueDate);
  return dueDate.getTime() === today.getTime();
}

function filterTasks(
  tasks: Assignment[],
  statusFilter: StatusFilter,
  discipline: string,
  completedTaskIds: string[],
  today: Date,
) {
  return tasks.filter((task) => {
    const completed = completedTaskIds.includes(task.id);
    const overdue = isOverdue(task, completed, today);
    const matchesStatus = statusFilter === 'ALL'
      || (statusFilter === 'COMPLETED' && completed)
      || (statusFilter === 'ACTIVE' && !completed && !overdue)
      || (statusFilter === 'OVERDUE' && overdue);

    return matchesStatus && (discipline === 'ALL' || task.course === discipline);
  });
}

function sortTasks(tasks: Assignment[], sortOrder: SortOrder) {
  return [...tasks].sort((left, right) => {
    if (sortOrder === 'TITLE') return left.title.localeCompare(right.title, 'uk');
    if (sortOrder === 'SOONEST') return 0;
    if (!left.dueDate) return 1;
    if (!right.dueDate) return -1;

    const dateDifference = parseLocalDate(left.dueDate).getTime()
      - parseLocalDate(right.dueDate).getTime();
    return sortOrder === 'LATEST' ? -dateDifference : dateDifference;
  });
}

export function AssignmentsPage() {
  const { completedTaskIds, toggleTask } = useTaskCompletion(
    ASSIGNMENTS,
    'epfk-organizer:assignment-completed-tasks',
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [discipline, setDiscipline] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('SOONEST');
  const today = ASSIGNMENTS_SNAPSHOT_DATE;
  const disciplines = useMemo(
    () => [...new Set(ASSIGNMENTS.map((task) => task.course))].sort((a, b) => a.localeCompare(b, 'uk')),
    [],
  );
  const visibleTasks = sortTasks(
    filterTasks(ASSIGNMENTS, statusFilter, discipline, completedTaskIds, today),
    sortOrder,
  );

  function resetFilters() {
    setStatusFilter('ALL');
    setDiscipline('ALL');
    setSortOrder('SOONEST');
  }

  return (
    <main className="assignments-page" aria-labelledby="assignments-title">
      <h1 id="assignments-title">Завдання</h1>

      <div className="assignment-tabs" aria-label="Стан завдань" role="group">
        {STATUS_TABS.map((tab) => (
          <button
            aria-pressed={statusFilter === tab.id}
            className={`assignment-tab ${statusFilter === tab.id ? 'assignment-tab--active' : ''}`}
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="assignments-content">
        <section className="assignment-feed" aria-label="Список завдань" aria-live="polite">
          {visibleTasks.length > 0 ? (
            <ul className="assignment-list">
              {visibleTasks.map((task) => (
                <li key={task.id}>
                  <AssignmentCard
                    completed={completedTaskIds.includes(task.id)}
                    onToggle={() => toggleTask(task.id)}
                    task={task}
                    urgent={isDueToday(task, today) || isOverdue(task, completedTaskIds.includes(task.id), today)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="assignment-empty-state">
              <span className="assignment-empty-state__icon" aria-hidden="true">✓</span>
              <h2>Тут поки немає завдань</h2>
              <p>Спробуйте вибрати іншу вкладку або змінити фільтри.</p>
              <button className="assignment-reset-link" onClick={resetFilters} type="button">
                Скинути фільтри
              </button>
            </div>
          )}
        </section>

        <aside className="assignment-filters" aria-labelledby="assignment-filters-title">
          <h2 id="assignment-filters-title">Фільтри</h2>

          <label className="assignment-filter-field assignment-filter-field--sort">
            <span>Сортування за дедлайном</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
              <option value="SOONEST">Спочатку найближчі</option>
              <option value="LATEST">Спочатку найпізніші</option>
              <option value="TITLE">За назвою</option>
            </select>
          </label>

          <label className="assignment-filter-field assignment-filter-field--discipline">
            <span>Дисципліна</span>
            <select value={discipline} onChange={(event) => setDiscipline(event.target.value)}>
              <option value="ALL">Усі дисципліни</option>
              {disciplines.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </label>

          <button className="assignment-filters__reset" onClick={resetFilters} type="button">
            Скинути фільтри
          </button>
        </aside>
      </div>
    </main>
  );
}

function AssignmentCard({ task, completed, urgent, onToggle }: {
  task: Assignment;
  completed: boolean;
  urgent: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`assignment-card ${completed ? 'assignment-card--completed' : ''}`}>
      <button
        aria-pressed={completed}
        className={`assignment-status ${completed ? 'assignment-status--completed' : ''}`}
        onClick={onToggle}
        type="button"
      >
        {completed ? 'Виконано' : 'Не виконано'}
      </button>

      <h2 className="assignment-card__title">{task.title}</h2>
      <p className="assignment-card__course">{task.course}</p>
      <p className="assignment-card__description">{task.description}</p>

      <div className="assignment-card__metadata">
        <p className={`assignment-card__deadline ${urgent && !completed ? 'assignment-card__deadline--urgent' : ''}`}>
          Дедлайн: {formatDueDate(task.dueDate, task.dueTime)}
        </p>
        <p className="assignment-card__source">{task.source} · Додано {task.addedAt}</p>
        {task.moodleUrl
          ? <a className="assignment-card__link" href={task.moodleUrl} target="_blank" rel="noreferrer">Перейти в Moodle</a>
          : <span className="assignment-card__link assignment-card__link--missing">Посилання відсутнє</span>}
      </div>
    </article>
  );
}
