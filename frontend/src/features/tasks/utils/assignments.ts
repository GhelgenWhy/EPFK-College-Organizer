import type { KyivTime } from '../hooks/useKyivClock';
import type { Assignment, SortOrder, StatusFilter } from '../types';

export function isOverdue(task: Assignment, completed: boolean, now: KyivTime) {
  if (completed || !task.dueDate) return false;

  const dueDateStr = String(task.dueDate);
  if (!dueDateStr || dueDateStr === '0' || dueDateStr === 'null') return false;

  if (dueDateStr < now.date) return true;
  if (dueDateStr > now.date || !task.dueTime) return false;

  return `${now.date}T${now.time}` >= `${dueDateStr}T${task.dueTime}:00`;
}

/** Deadline state for a card: overdue, approaching (within 3 days) or normal. Completed tasks are always normal. */
export function getDeadlineState(task: Assignment, completed: boolean, now: KyivTime): 'overdue' | 'approaching' | 'normal' {
  if (completed || !task.dueDate) return 'normal';
  if (isOverdue(task, completed, now)) return 'overdue';
  const today = Date.parse(`${now.date}T00:00:00Z`);
  const due = Date.parse(`${String(task.dueDate)}T00:00:00Z`);
  const daysLeft = Math.round((due - today) / 86_400_000);
  return daysLeft >= 0 && daysLeft <= 3 ? 'approaching' : 'normal';
}

export function isDueToday(task: Assignment, now: KyivTime) {
  if (!task.dueDate) return false;
  const dueDateStr = String(task.dueDate);
  return dueDateStr === now.date;
}

export function getDisciplines(tasks: Assignment[]) {
  return [...new Set(tasks.map((task) => task.course))].sort((a, b) =>
    a.localeCompare(b, 'uk'),
  );
}

export function filterTasks(
  tasks: Assignment[],
  statusFilter: StatusFilter,
  discipline: string,
  completedTaskIds: string[],
  now: KyivTime,
) {
  return tasks.filter((task) => {
    const completed = completedTaskIds.includes(task.id);
    const overdue = isOverdue(task, completed, now);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'COMPLETED' && completed) ||
      (statusFilter === 'ACTIVE' && !completed && !overdue) ||
      (statusFilter === 'OVERDUE' && overdue);

    return (
      matchesStatus && (discipline === 'ALL' || task.course === discipline)
    );
  });
}

export function sortTasks(tasks: Assignment[], sortOrder: SortOrder) {
  return [...tasks].sort((left, right) => {
    if (sortOrder === 'TITLE')
      return left.title.localeCompare(right.title, 'uk');
    if (!left.dueDate && !right.dueDate) return 0;
    if (!left.dueDate) return 1;
    if (!right.dueDate) return -1;

    const leftDateStr = String(left.dueDate);
    const rightDateStr = String(right.dueDate);

    const leftDeadline = `${leftDateStr}T${left.dueTime ?? '23:59'}`;
    const rightDeadline = `${rightDateStr}T${right.dueTime ?? '23:59'}`;
    const comparison = leftDeadline.localeCompare(rightDeadline);
    return sortOrder === 'LATEST' ? -comparison : comparison;
  });
}
