import type { KyivTime } from '../hooks/useKyivClock';
import type { Assignment, MarkSource } from '../types';
import { getDeadlineState } from '../utils/assignments';
import { AssignmentCard } from './AssignmentCard';

export function AssignmentsList({
  tasks,
  completedTaskIds,
  markSources,
  onToggleTask,
  now,
  onResetFilters,
}: {
  tasks: Assignment[];
  completedTaskIds: string[];
  /** Who completed each task: 'SYSTEM' (locked) or 'USER' (editable until synced). */
  markSources: Record<string, MarkSource>;
  onToggleTask: (taskId: string) => void;
  now: KyivTime;
  onResetFilters: () => void;
}) {
  return (
    <section
      className="flex min-h-0 min-w-0 flex-col overflow-y-auto scrollbar-none [grid-area:feed] max-h-full pr-1 max-[760px]:order-2"
      aria-label="Список завдань"
      aria-live="polite"
    >
      {tasks.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-[13px] p-0 max-[760px]:gap-[9px]">
          {tasks.map((task) => {
            const completed = completedTaskIds.includes(task.id);
            return (
              <li key={task.id}>
                <AssignmentCard
                  completed={completed}
                  source={markSources[task.id] ?? null}
                  onToggle={() => onToggleTask(task.id)}
                  task={task}
                  deadlineState={getDeadlineState(task, completed, now)}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex min-h-[245px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[var(--border)] bg-surface/55 px-5 py-7 text-center">
          <span
            className="grid h-[42px] w-[42px] place-items-center rounded-full bg-[var(--success-soft)] text-lg text-[var(--accent)]"
            aria-hidden="true"
          >
            ✓
          </span>
          <h2 className="mt-3 text-[15px] font-normal text-primary">
            Тут поки немає завдань
          </h2>
          <p className="mt-[5px] max-w-[260px] text-[11px] leading-[1.5] text-secondary">
            Спробуйте вибрати іншу вкладку або змінити фільтри.
          </p>
          <button
            style={{ cursor: 'pointer' }}
            className="relative z-10 mt-[7px] inline-flex w-fit min-h-[34px] items-center justify-center rounded-lg border-0 bg-transparent font-bold text-[var(--accent)] hover:underline hover:underline-offset-[3px] focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px]"
            onClick={onResetFilters}
            type="button"
          >
            Скинути фільтри
          </button>
        </div>
      )}
    </section>
  );
}
