export interface HomeworkTask {
  id: string;
  title: string;
  course: string;
  dueDate: string;
}

export interface Assignment extends Omit<HomeworkTask, 'dueDate'> {
  dueDate: string | null;
  dueTime?: string;
  description: string;
  source: string;
  addedAt: string;
  moodleUrl?: string;
  /** Completion status from Moodle, as synced by the backend. */
  isCompleted?: boolean;
}

export type StatusFilter = 'ALL' | 'COMPLETED' | 'ACTIVE' | 'OVERDUE';

export type SortOrder = 'SOONEST' | 'LATEST' | 'TITLE';

/** Who marked a task completed: the system (Moodle sync, locked) or the user (editable until synced). */
export type MarkSource = 'SYSTEM' | 'USER';

/** Filter by marker: all tasks, only system-marked, or only user-marked. */
export type MarkFilter = 'ALL' | MarkSource;

export type DeadlineState = 'overdue' | 'approaching' | 'normal';
