import { useMemo, useState } from 'react';
import { useTaskCompletion } from '../features/tasks/hooks/useTaskCompletion';
import { useKyivClock, type KyivTime } from '../features/tasks/hooks/useKyivClock';
import { moodleApi } from '../services/api/moodle';
import { useApiQuery } from '../services/api/useApiQuery';
import { ApiQueryStatus } from '../components/ApiQueryStatus';
import type { Assignment } from '../features/tasks/types';
import { AssignmentCard } from '../components/assignments/AssignmentCard';

type StatusFilter = 'ALL' | 'COMPLETED' | 'ACTIVE' | 'OVERDUE';
type SortOrder = 'SOONEST' | 'LATEST' | 'TITLE';

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'ALL', label: 'Всі' },
  { id: 'COMPLETED', label: 'Виконані' },
  { id: 'ACTIVE', label: 'Актуальні' },
  { id: 'OVERDUE', label: 'Прострочені' },
];

function isOverdue(task: Assignment, completed: boolean, now: KyivTime) {
  if (completed || !task.dueDate) return false;
  if (task.dueDate < now.date) return true;
  if (task.dueDate > now.date || !task.dueTime) return false;

  return `${now.date}T${now.time}` >= `${task.dueDate}T${task.dueTime}:00`;
}

function isDueToday(task: Assignment, now: KyivTime) {
  return task.dueDate === now.date;
}

function filterTasks(
  tasks: Assignment[],
  statusFilter: StatusFilter,
  discipline: string,
  completedTaskIds: string[],
  now: KyivTime,
) {
  return tasks.filter((task) => {
    const completed = completedTaskIds.includes(task.id);
    const overdue = isOverdue(task, completed, now);
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
    if (!left.dueDate && !right.dueDate) return 0;
    if (!left.dueDate) return 1;
    if (!right.dueDate) return -1;

    const leftDeadline = `${left.dueDate}T${left.dueTime ?? '23:59'}`;
    const rightDeadline = `${right.dueDate}T${right.dueTime ?? '23:59'}`;
    const comparison = leftDeadline.localeCompare(rightDeadline);
    return sortOrder === 'LATEST' ? -comparison : comparison;
  });
}

export function AssignmentsPage() {
  const query = useApiQuery(moodleApi.getAssignments);
  if (!query.data) return (
    <main className="min-h-0 flex-1 overflow-auto p-6">
      <h1 className="mb-5 text-3xl font-bold text-primary">Завдання</h1>
      <ApiQueryStatus query={query} loadingText="Завантаження завдань з Moodle…" />
    </main>
  );
  return <AssignmentsContent key={query.userId} tasks={query.data} storageKey={`epfk-organizer:${query.userId}:assignment-completed-tasks`} />;
}

function AssignmentsContent({ tasks, storageKey }: { tasks: Assignment[]; storageKey: string }) {
  const { completedTaskIds, toggleTask } = useTaskCompletion(
    tasks,
    storageKey,
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [discipline, setDiscipline] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('SOONEST');
  const now = useKyivClock();
  const disciplines = useMemo(
    () => [...new Set(tasks.map((task) => task.course))].sort((a, b) => a.localeCompare(b, 'uk')),
    [tasks],
  );
  const visibleTasks = sortTasks(
    filterTasks(tasks, statusFilter, discipline, completedTaskIds, now),
    sortOrder,
  );

  function resetFilters() {
    setStatusFilter('ALL');
    setDiscipline('ALL');
    setSortOrder('SOONEST');
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-[13px] overflow-auto px-[40px] pt-[29px] pr-[40px] pb-6 max-[1250px]:px-6 max-[760px]:gap-[14px] max-[760px]:px-1 max-[760px]:py-4" aria-labelledby="assignments-title">
      <h1 id="assignments-title" className="translate-y-1 text-[33px] font-bold leading-[1.15] tracking-[-0.045em] text-primary max-[760px]:text-[29px]">Завдання</h1>

      <div className="relative top-[5px] inline-flex min-h-[46px] w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-xl bg-surface p-1 [scrollbar-width:none] max-[760px]:top-0 max-[760px]:min-h-[43px]" aria-label="Стан завдань" role="group">
        {STATUS_TABS.map((tab) => (
          <button
            aria-pressed={statusFilter === tab.id}
            className={`inline-flex min-h-[38px] flex-[0_0_auto] items-center justify-center rounded-[10px] border-0 px-[8.5px] text-[13px] font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:min-h-[35px] max-[760px]:px-[9px] max-[760px]:text-[10px] max-[380px]:px-[7px] max-[380px]:text-[9px] ${statusFilter === tab.id ? 'bg-[var(--accent)] text-on-accent hover:bg-[var(--accent-hover)]' : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-primary'}`}
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative top-px grid min-w-0 grid-cols-[minmax(0,2.265fr)_minmax(380px,1fr)] [grid-template-areas:'feed_filters'] items-start gap-[26px] max-[1250px]:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)] max-[1250px]:gap-4 max-[760px]:top-0 max-[760px]:grid-cols-1 max-[760px]:[grid-template-areas:'filters'_'feed'] max-[760px]:gap-3">
        <section className="min-w-0 [grid-area:feed] max-[760px]:order-2" aria-label="Список завдань" aria-live="polite">
          {visibleTasks.length > 0 ? (
            <ul className="m-0 flex list-none flex-col gap-[13px] p-0 max-[760px]:gap-[9px]">
              {visibleTasks.map((task) => (
                <li key={task.id}>
                  <AssignmentCard
                    completed={completedTaskIds.includes(task.id)}
                    onToggle={() => toggleTask(task.id)}
                    task={task}
                    urgent={isDueToday(task, now) || isOverdue(task, completedTaskIds.includes(task.id), now)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex min-h-[245px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[var(--border)] bg-surface/55 px-5 py-7 text-center">
              <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-[var(--success-soft)] text-lg text-[var(--accent)]" aria-hidden="true">✓</span>
              <h2 className="mt-3 text-[15px] font-normal text-primary">Тут поки немає завдань</h2>
              <p className="mt-[5px] max-w-[260px] text-[11px] leading-[1.5] text-secondary">Спробуйте вибрати іншу вкладку або змінити фільтри.</p>
              <button className="mt-[7px] inline-flex min-h-[34px] items-center justify-center rounded-lg border-0 bg-transparent font-bold text-[var(--accent)] hover:underline hover:underline-offset-[3px] focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px]" onClick={resetFilters} type="button">
                Скинути фільтри
              </button>
            </div>
          )}
        </section>

        <aside className="[grid-area:filters] flex min-h-[306px] min-w-0 flex-col items-start gap-4 rounded-[19px] bg-surface px-[22px] py-[21px] max-[1250px]:min-w-0 max-[760px]:order-1 max-[760px]:grid max-[760px]:min-h-0 max-[760px]:grid-cols-2 max-[760px]:items-end max-[760px]:gap-3 max-[760px]:p-[14px] max-[380px]:grid-cols-1" aria-labelledby="assignment-filters-title">
          <h2 id="assignment-filters-title" className="text-[19px] font-bold leading-[1.3] tracking-[-0.025em] text-primary max-[760px]:col-span-full max-[760px]:text-base max-[380px]:col-span-1">Фільтри</h2>

          <label className="flex min-w-0 flex-col gap-[10px] text-[13px] font-semibold text-primary max-[760px]:gap-[6px] max-[760px]:text-[9px]">
            <span>Сортування за дедлайном</span>
            <select className="min-h-[46px] w-max max-w-full min-w-0 cursor-pointer appearance-auto rounded-[11px] border-0 bg-[var(--input-background)] py-0 pr-3 pl-3 font-normal text-[13px] text-primary focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:min-h-[39px] max-[760px]:w-full max-[760px]:pl-2 max-[760px]:text-[10px]" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
              <option value="SOONEST">Спочатку найближчі</option>
              <option value="LATEST">Спочатку найпізніші</option>
              <option value="TITLE">За назвою</option>
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-[10px] text-[13px] font-semibold text-primary max-[760px]:gap-[6px] max-[760px]:text-[9px]">
            <span>Дисципліна</span>
            <select className="min-h-[46px] w-[137px] max-w-full min-w-0 cursor-pointer appearance-auto rounded-[11px] border-0 bg-[var(--input-background)] py-0 pr-3 pl-3 font-normal text-[13px] text-primary focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:min-h-[39px] max-[760px]:w-full max-[760px]:pl-2 max-[760px]:text-[10px]" value={discipline} onChange={(event) => setDiscipline(event.target.value)}>
              <option value="ALL">Усі дисципліни</option>
              {disciplines.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </label>

          <button className="ml-[10px] inline-flex min-h-[34px] items-center justify-center rounded-lg border-0 bg-transparent font-bold text-[13px] text-[var(--accent)] hover:underline hover:underline-offset-[3px] focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:col-span-full max-[760px]:min-h-[28px] max-[760px]:justify-self-start max-[760px]:ml-0 max-[760px]:text-[10px] max-[380px]:col-span-1" onClick={resetFilters} type="button">
            Скинути фільтри
          </button>
        </aside>
      </div>
    </main>
  );
}

