import { useMemo, useState } from 'react';
import { useKyivClock } from '../hooks/useKyivClock';
import { useTaskCompletion } from '../hooks/useTaskCompletion';
import type { Assignment, MarkFilter, MarkSource, SortOrder, StatusFilter } from '../types';
import { filterTasks, getDisciplines, sortTasks } from '../utils/assignments';
import { AssignmentsList } from './AssignmentsGrid';
import { AssignmentsFiltersPanel, AssignmentsStatusTabs } from './AssignmentsToolbar';

export function AssignmentsContent({
  tasks,
  storageKey,
}: {
  tasks: Assignment[];
  storageKey: string;
}) {
  // Local storage keeps the user's own marks. A completion confirmed by the system (Moodle sync)
  // takes precedence and locks the task: the user can no longer change it.
  const { completedTaskIds: userMarkIds, toggleTask } = useTaskCompletion(tasks, storageKey);
  const markSources: Record<string, MarkSource> = {};
  for (const id of userMarkIds) markSources[id] = 'USER';
  for (const task of tasks) {
    if (task.isCompleted) markSources[task.id] = 'SYSTEM';
  }
  const completedTaskIds = Object.keys(markSources);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [markFilter, setMarkFilter] = useState<MarkFilter>('ALL');
  const [discipline, setDiscipline] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('SOONEST');
  const now = useKyivClock();
  const disciplines = useMemo(() => getDisciplines(tasks), [tasks]);
  const visibleTasks = sortTasks(
    filterTasks(tasks, statusFilter, discipline, completedTaskIds, now)
      .filter((task) => markFilter === 'ALL' || markSources[task.id] === markFilter),
    sortOrder,
  );

  function handleToggle(taskId: string) {
    // System-confirmed completion is fixed; only the user's own marks can be changed.
    if (markSources[taskId] === 'SYSTEM') return;
    toggleTask(taskId);
  }

  function resetFilters() {
    setStatusFilter('ALL');
    setMarkFilter('ALL');
    setDiscipline('ALL');
    setSortOrder('SOONEST');
  }

  return (
    <main
      className="flex h-full min-h-0 flex-1 flex-col gap-[13px] px-[40px] pt-[29px] pr-[40px] pb-6 max-[1250px]:px-6 max-[760px]:gap-[14px] max-[760px]:px-1 max-[760px]:py-4"
      aria-labelledby="assignments-title"
    >
      <h1
        id="assignments-title"
        className="translate-y-1 shrink-0 text-[33px] font-bold leading-[1.15] tracking-[-0.045em] text-primary max-[760px]:text-[29px]"
      >
        Завдання
      </h1>

      <AssignmentsStatusTabs
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="relative top-px grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,2.265fr)_minmax(380px,1fr)] [grid-template-areas:'feed_filters'] items-start gap-[26px] max-[1250px]:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)] max-[1250px]:gap-4 max-[760px]:top-0 max-[760px]:grid-cols-1 max-[760px]:[grid-template-areas:'filters'_'feed'] max-[760px]:gap-3 max-[760px]:overflow-y-auto">
        <AssignmentsList
          tasks={visibleTasks}
          completedTaskIds={completedTaskIds}
          markSources={markSources}
          onToggleTask={handleToggle}
          now={now}
          onResetFilters={resetFilters}
        />

        {/* Панель фільтрів */}
        <AssignmentsFiltersPanel
          disciplines={disciplines}
          discipline={discipline}
          onDisciplineChange={setDiscipline}
          markFilter={markFilter}
          onMarkFilterChange={setMarkFilter}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onResetFilters={resetFilters}
        />
      </div>
    </main>
  );
}
