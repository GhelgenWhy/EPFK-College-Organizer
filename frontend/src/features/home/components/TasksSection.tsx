import type { HomeworkTask } from "../types";
import { formatDate, parseLocalDate } from "../utils/date";
import { SectionHeading } from "./SectionHeading";

function TaskRow({
  task,
  completed,
  onToggle,
}: {
  task: HomeworkTask;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex min-h-0 min-w-0 flex-1 items-center border-b border-[var(--border)] last:border-b-0 max-[760px]:min-h-[88px]">
      <label className="flex min-w-0 cursor-pointer items-start gap-[10px] max-[760px]:gap-3">
        <input
          className="mt-px h-6 w-6 cursor-pointer shrink-0 appearance-none rounded-full border-2 border-[var(--accent)] bg-surface checked:border-[var(--accent)] checked:bg-[var(--accent)] checked:shadow-[inset_0_0_0_5px_var(--surface)] focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:h-[22px] max-[760px]:w-[22px]"
          aria-label={`Позначити завдання «${task.title}» як виконане`}
          checked={completed}
          onChange={onToggle}
          type="checkbox"
        />
        <span className="flex min-w-0 flex-col items-start">
          <span
            title={task.title}
            className={`line-clamp-2 max-w-full break-words text-[15px] leading-[1.45] font-bold text-primary max-[760px]:text-xs ${completed ? "text-[var(--text-muted)] line-through decoration-[var(--text-muted)]" : ""}`}
          >
            {task.title}
          </span>
          <span className="mt-[6px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[var(--text-muted)]">
            {task.course}
          </span>
          <time
            className="mt-2 text-xs font-semibold text-[var(--accent)] max-[760px]:text-[10px]"
            dateTime={task.dueDate}
          >
            До{" "}
            {formatDate(parseLocalDate(task.dueDate), {
              day: "numeric",
              month: "long",
            })}
          </time>
        </span>
      </label>
    </li>
  );
}

export function TasksSection({
  tasks,
  completedTaskIds,
  onToggleTask,
}: {
  tasks: HomeworkTask[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}) {
  const completedCount = tasks.filter((task) =>
    completedTaskIds.includes(task.id),
  ).length;

  return (
    <section
      className="flex min-h-0 min-w-0 flex-col rounded-[19px] bg-surface p-3 max-[760px]:col-start-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]"
      aria-labelledby="my-tasks-heading"
    >
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
