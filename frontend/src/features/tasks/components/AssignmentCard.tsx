import type { Assignment, DeadlineState, MarkSource } from '../types';
import { textOr } from '../../../lib/nullSafe';

function formatDateOnly(date: string) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatDueDate(date: string | null, dueTime?: string) {
  if (!date) return 'Без дедлайну';
  const formattedDate = formatDateOnly(date);
  return `${formattedDate}${dueTime ? `, ${dueTime}` : ''}`;
}

const SOURCE_LABEL: Record<MarkSource, string> = {
  SYSTEM: 'Відмічено системою',
  USER: 'Відмічено вами',
};

export function AssignmentCard({ task, completed, source, deadlineState, onToggle }: {
  task: Assignment;
  completed: boolean;
  /** Who marked the task completed; null while it is open. */
  source: MarkSource | null;
  deadlineState: DeadlineState;
  onToggle: () => void;
}) {
  // A completion confirmed by the system is fixed: the user cannot change it any more.
  const locked = source === 'SYSTEM';
  const overdue = !completed && deadlineState === 'overdue';
  const approaching = !completed && deadlineState === 'approaching';

  // The status button itself shows the deadline state of an open task; clicking it marks the task done.
  const buttonLabel = completed
    ? 'Виконано'
    : overdue
      ? 'Прострочено'
      : approaching
        ? 'Наближається дедлайн'
        : 'Не виконано';
  const buttonTone = completed
    ? 'bg-[var(--success)] text-on-accent'
    : overdue
      ? 'bg-[var(--danger)] text-on-accent'
      : approaching
        ? 'bg-[var(--warning)] text-on-accent'
        : 'bg-info-soft text-primary';
  // The state is shown by the card background (no coloured outline, which read as "selected").
  const cardTone = completed
    ? 'bg-[var(--lesson-background)]'
    : approaching
      ? 'bg-[var(--current-lesson-soft)]'
      : overdue
        ? 'bg-[var(--danger-soft)]'
        : 'bg-surface';

  return (
    <article className={`relative min-w-0 min-h-[142px] rounded-[18px] border border-border py-[14px] pr-[160px] pb-[13px] pl-4 transition-shadow hover:shadow-[0_3px_12px_var(--shadow-subtle-color)] max-[1250px]:pr-[150px] max-[760px]:min-h-0 max-[760px]:rounded-[15px] max-[760px]:py-[14px] max-[760px]:pr-[128px] max-[760px]:pb-3 max-[760px]:pl-[13px] max-[380px]:pr-[13px] ${cardTone}`}>
      <button
        aria-pressed={completed}
        disabled={locked}
        title={locked ? 'Відмічено системою, змінити не можна' : undefined}
        className={`absolute top-[15px] right-[15px] inline-flex min-h-[41px] w-[136px] cursor-pointer items-center justify-center whitespace-nowrap rounded-xl border-0 px-[7px] font-semibold text-[10px] transition-[filter] hover:brightness-95 disabled:cursor-default disabled:hover:brightness-100 focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-[3px] max-[760px]:top-3 max-[760px]:right-[11px] max-[760px]:min-h-[34px] max-[760px]:w-[118px] max-[760px]:rounded-[10px] max-[760px]:text-[9px] max-[380px]:static max-[380px]:mb-[10px] max-[380px]:min-h-7 max-[380px]:w-auto max-[380px]:px-[9px] ${buttonTone}`}
        onClick={onToggle}
        type="button"
      >
        {buttonLabel}
      </button>

      {/* Long titles are clamped to two lines so the card keeps its height; full text on hover. */}
      <h2
        title={task.title}
        className={`line-clamp-2 max-w-full break-words text-base font-bold leading-[1.35] tracking-[-0.015em] text-primary ${completed ? 'text-secondary' : ''} max-[760px]:text-[13px]`}
      >
        {task.title}
      </h2>
      <p className="mt-[13px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold leading-[1.3] text-accent max-[760px]:mt-[10px] max-[760px]:text-[10px]">{task.course}</p>
      <p className="mt-[9px] max-w-full overflow-hidden text-ellipsis text-xs leading-[1.4] text-secondary max-[760px]:mt-[5px] max-[760px]:text-[9px]">{textOr(task.description, '')}</p>

      <div className="mt-[6px] flex min-w-0 flex-wrap items-center gap-x-3 gap-y-[7px] max-[760px]:mt-2 max-[760px]:gap-[7px]">
        <p className={`whitespace-nowrap text-xs leading-[1.4] max-[760px]:text-[9px] ${overdue ? 'font-semibold text-danger' : 'text-secondary'}`}>
          Дедлайн: {formatDueDate(task.dueDate, task.dueTime)}
        </p>
        <p className="whitespace-nowrap text-[10px] leading-[1.4] text-muted max-[760px]:text-[8px]">{task.source} · Додано {task.addedAt}</p>
        {source && (
          <span className="whitespace-nowrap rounded-md bg-surface px-2 py-[3px] text-[10px] font-semibold text-secondary max-[760px]:text-[8px]">
            {SOURCE_LABEL[source]}
          </span>
        )}
        {task.moodleUrl
          ? <a className="inline-flex min-h-7 items-center justify-center whitespace-nowrap rounded-[9px] border-0 bg-accent px-[9px] text-[10px] font-semibold text-on-accent no-underline transition-colors hover:bg-accent-hover focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-[3px] max-[760px]:min-h-[26px] max-[760px]:text-[8px]" href={task.moodleUrl} target="_blank" rel="noreferrer">Перейти в Moodle</a>
          : <span className="inline-flex min-h-7 items-center justify-center whitespace-nowrap rounded-[9px] border-0 bg-surface-muted px-[9px] text-[10px] font-semibold text-muted max-[760px]:min-h-[26px] max-[760px]:text-[8px]">Посилання відсутнє</span>}
      </div>
    </article>
  );
}
