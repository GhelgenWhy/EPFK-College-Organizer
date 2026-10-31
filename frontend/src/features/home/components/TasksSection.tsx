import type { HomeworkTask } from "../types";
import { formatDate, parseLocalDate } from "../utils/date";
import { SectionHeading } from "./SectionHeading";

function TaskRow({
  task,
  completed,
}: {
  task: HomeworkTask;
  completed: boolean;
}) {
  return (
    <li className="flex min-h-0 min-w-0 flex-1 items-center border-b border-[var(--border)] last:border-b-0 max-[760px]:min-h-[88px]">
      <div className="flex min-w-0 items-start gap-[10px] max-[760px]:gap-3">
        {/* Read-only status marker: completion is set on the Assignments page, not here. */}
        <span
          aria-hidden="true"
          className={`mt-px grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-[var(--accent)] bg-surface max-[760px]:h-[22px] max-[760px]:w-[22px] ${completed ? "bg-[var(--accent)]" : ""}`}
        >
          {completed && <span className="h-[7px] w-[7px] rounded-full bg-surface" />}
        </span>
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
      </div>
    </li>
  );
}

export function TasksSection({
  tasks,
  completedTaskIds,
}: {
  tasks: HomeworkTask[];
  completedTaskIds: string[];
  onToggleTask?: (taskId: string) => void;
}) {
  // Only open tasks are shown: completed ones leave the list right away.
  const openTasks = tasks.filter((task) => !completedTaskIds.includes(task.id));

  return (
    <section
      className="flex min-h-0 min-w-0 flex-col rounded-[19px] bg-surface p-3 max-[760px]:col-start-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]"
      aria-labelledby="my-tasks-heading"
    >
      <SectionHeading
        id="my-tasks-heading"
        title="Мої завдання"
        subtitle="Невиконані завдання"
      />
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col p-0 pt-0.5">
        {openTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            completed={false}
          />
        ))}
      </ul>
    </section>
  );
}
