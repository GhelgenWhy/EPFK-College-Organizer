import { useMemo, useState } from 'react';
import { useTaskCompletion } from '../hooks/useTaskCompletion';
import { useKyivClock, type KyivTime } from '../hooks/useKyivClock';
import { ASSIGNMENTS } from '../assignmentsData';
import type { Assignment } from '../types';

type StatusFilter = 'ALL' | 'COMPLETED' | 'ACTIVE' | 'OVERDUE';
type SortOrder = 'SOONEST' | 'LATEST' | 'TITLE';

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'ALL', label: 'Всі' },
  { id: 'COMPLETED', label: 'Виконані' },
  { id: 'ACTIVE', label: 'Актуальні' },
  { id: 'OVERDUE', label: 'Прострочені' },
];

function formatDateOnly(date: string) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatDueDate(date: string | null, dueTime?: string) {
  if (!date) return 'Без дедлайну';
  const formattedDate = formatDateOnly(date);
  return `${formattedDate}${dueTime ? `, ${dueTime}` : ''}`;
}

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
    if (!left.dueDate) return 1;
    if (!right.dueDate) return -1;

    const leftDeadline = `${left.dueDate}T${left.dueTime ?? '23:59'}`;
    const rightDeadline = `${right.dueDate}T${right.dueTime ?? '23:59'}`;
    const comparison = leftDeadline.localeCompare(rightDeadline);
    return sortOrder === 'LATEST' ? -comparison : comparison;
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
  const now = useKyivClock();
  const disciplines = useMemo(
    () => [...new Set(ASSIGNMENTS.map((task) => task.course))].sort((a, b) => a.localeCompare(b, 'uk')),
    [],
  );
  const visibleTasks = sortTasks(
    filterTasks(ASSIGNMENTS, statusFilter, discipline, completedTaskIds, now),
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

      <div className="relative top-[5px] inline-flex min-h-[46px] w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-xl bg-white p-1 [scrollbar-width:none] max-[760px]:top-0 max-[760px]:min-h-[43px]" aria-label="Стан завдань" role="group">
        {STATUS_TABS.map((tab) => (
          <button
            aria-pressed={statusFilter === tab.id}
            className={`inline-flex min-h-[38px] flex-[0_0_auto] items-center justify-center rounded-[10px] border-0 px-[8.5px] text-[13px] font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-[#0b8580] focus-visible:outline-offset-[3px] max-[760px]:min-h-[35px] max-[760px]:px-[9px] max-[760px]:text-[10px] max-[380px]:px-[7px] max-[380px]:text-[9px] ${statusFilter === tab.id ? 'bg-[#079b98] text-white hover:bg-[#078582]' : 'bg-transparent text-[#626262] hover:bg-[#eef7f6] hover:text-primary'}`}
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
            <div className="flex min-h-[245px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#cfdfda] bg-white/55 px-5 py-7 text-center">
              <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-[#e6f3ee] text-lg text-[#079b98]" aria-hidden="true">✓</span>
              <h2 className="mt-3 text-[15px] font-normal text-primary">Тут поки немає завдань</h2>
              <p className="mt-[5px] max-w-[260px] text-[11px] leading-[1.5] text-secondary">Спробуйте вибрати іншу вкладку або змінити фільтри.</p>
              <button className="mt-[7px] inline-flex min-h-[34px] items-center justify-center rounded-lg border-0 bg-transparent font-bold text-[#079b98] hover:underline hover:underline-offset-[3px] focus-visible:outline-3 focus-visible:outline-[#0b8580] focus-visible:outline-offset-[3px]" onClick={resetFilters} type="button">
                Скинути фільтри
              </button>
            </div>
          )}
        </section>

        <aside className="[grid-area:filters] flex min-h-[306px] min-w-0 flex-col items-start gap-4 rounded-[19px] bg-white px-[22px] py-[21px] max-[1250px]:min-w-0 max-[760px]:order-1 max-[760px]:grid max-[760px]:min-h-0 max-[760px]:grid-cols-2 max-[760px]:items-end max-[760px]:gap-3 max-[760px]:p-[14px] max-[380px]:grid-cols-1" aria-labelledby="assignment-filters-title">
          <h2 id="assignment-filters-title" className="text-[19px] font-bold leading-[1.3] tracking-[-0.025em] text-primary max-[760px]:col-span-full max-[760px]:text-base max-[380px]:col-span-1">Фільтри</h2>

          <label className="flex min-w-0 flex-col gap-[10px] text-[13px] font-semibold text-primary max-[760px]:gap-[6px] max-[760px]:text-[9px]">
            <span>Сортування за дедлайном</span>
            <select className="min-h-[46px] w-max max-w-full min-w-0 cursor-pointer appearance-auto rounded-[11px] border-0 bg-[#f7f7f7] py-0 pr-3 pl-3 font-normal text-[13px] text-primary focus-visible:outline-3 focus-visible:outline-[#0b8580] focus-visible:outline-offset-[3px] max-[760px]:min-h-[39px] max-[760px]:w-full max-[760px]:pl-2 max-[760px]:text-[10px]" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
              <option value="SOONEST">Спочатку найближчі</option>
              <option value="LATEST">Спочатку найпізніші</option>
              <option value="TITLE">За назвою</option>
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-[10px] text-[13px] font-semibold text-primary max-[760px]:gap-[6px] max-[760px]:text-[9px]">
            <span>Дисципліна</span>
            <select className="min-h-[46px] w-[137px] max-w-full min-w-0 cursor-pointer appearance-auto rounded-[11px] border-0 bg-[#f7f7f7] py-0 pr-3 pl-3 font-normal text-[13px] text-primary focus-visible:outline-3 focus-visible:outline-[#0b8580] focus-visible:outline-offset-[3px] max-[760px]:min-h-[39px] max-[760px]:w-full max-[760px]:pl-2 max-[760px]:text-[10px]" value={discipline} onChange={(event) => setDiscipline(event.target.value)}>
              <option value="ALL">Усі дисципліни</option>
              {disciplines.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </label>

          <button className="ml-[10px] inline-flex min-h-[34px] items-center justify-center rounded-lg border-0 bg-transparent font-bold text-[13px] text-[#079b98] hover:underline hover:underline-offset-[3px] focus-visible:outline-3 focus-visible:outline-[#0b8580] focus-visible:outline-offset-[3px] max-[760px]:col-span-full max-[760px]:min-h-[28px] max-[760px]:justify-self-start max-[760px]:ml-0 max-[760px]:text-[10px] max-[380px]:col-span-1" onClick={resetFilters} type="button">
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
    <article className={`relative min-w-0 min-h-[142px] rounded-[18px] border border-[#e1eae7] py-[14px] pr-[112px] pb-[13px] pl-4 transition-[border-color,box-shadow] hover:border-[#cfdfda] hover:shadow-[0_3px_12px_rgba(1,37,59,0.035)] max-[1250px]:pr-[105px] max-[760px]:min-h-0 max-[760px]:rounded-[15px] max-[760px]:py-[14px] max-[760px]:pr-[95px] max-[760px]:pb-3 max-[760px]:pl-[13px] max-[380px]:pr-[13px] ${completed ? 'bg-[#fbfcfb]' : 'bg-white'}`}>
      <button
        aria-pressed={completed}
        className={`absolute top-[15px] right-[15px] inline-flex min-h-[41px] w-[86px] cursor-pointer items-center justify-center whitespace-nowrap rounded-xl border-0 px-[7px] font-semibold text-[10px] transition-[filter] hover:brightness-95 focus-visible:outline-3 focus-visible:outline-[#0b8580] focus-visible:outline-offset-[3px] max-[760px]:top-3 max-[760px]:right-[11px] max-[760px]:min-h-[34px] max-[760px]:w-[77px] max-[760px]:rounded-[10px] max-[760px]:text-[9px] max-[380px]:static max-[380px]:mb-[10px] max-[380px]:min-h-7 max-[380px]:w-auto max-[380px]:px-[9px] ${completed ? 'bg-[#dff0eb] text-link' : 'bg-[#c2edf8] text-primary'}`}
        onClick={onToggle}
        type="button"
      >
        {completed ? 'Виконано' : 'Не виконано'}
      </button>

      <h2 className={`max-w-full overflow-hidden text-ellipsis text-base font-bold leading-[1.35] tracking-[-0.015em] text-primary ${completed ? 'text-secondary' : ''} max-[760px]:text-[13px]`}>{task.title}</h2>
      <p className="mt-[13px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold leading-[1.3] text-[#079b98] max-[760px]:mt-[10px] max-[760px]:text-[10px]">{task.course}</p>
      <p className="mt-[9px] max-w-full overflow-hidden text-ellipsis text-xs leading-[1.4] text-[#686868] max-[760px]:mt-[5px] max-[760px]:text-[9px]">{task.description}</p>

      <div className="mt-[6px] flex min-w-0 flex-wrap items-center gap-x-3 gap-y-[7px] max-[760px]:mt-2 max-[760px]:gap-[7px]">
        <p className={`whitespace-nowrap text-xs leading-[1.4] text-[#696969] max-[760px]:text-[9px] ${urgent && !completed ? 'text-[#ff9a9c]' : ''}`}>
          Дедлайн: {formatDueDate(task.dueDate, task.dueTime)}
        </p>
        <p className="whitespace-nowrap text-[10px] leading-[1.4] text-[#aaa] max-[760px]:text-[8px]">{task.source} · Додано {task.addedAt}</p>
        {task.moodleUrl
          ? <a className="inline-flex min-h-7 items-center justify-center whitespace-nowrap rounded-[9px] border-0 bg-[#079b98] px-[9px] text-[10px] font-semibold text-white no-underline transition-colors hover:bg-[#078582] focus-visible:outline-3 focus-visible:outline-[#0b8580] focus-visible:outline-offset-[3px] max-[760px]:min-h-[26px] max-[760px]:text-[8px]" href={task.moodleUrl} target="_blank" rel="noreferrer">Перейти в Moodle</a>
          : <span className="inline-flex min-h-7 items-center justify-center whitespace-nowrap rounded-[9px] border-0 bg-[#f6f6f6] px-[9px] text-[10px] font-semibold text-[#aaa] max-[760px]:min-h-[26px] max-[760px]:text-[8px]">Посилання відсутнє</span>}
      </div>
    </article>
  );
}
