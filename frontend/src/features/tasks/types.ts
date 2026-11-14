export interface HomeworkTask {
  id: string;
  title: string;
  course: string;
  dueDate: string | null;
}

export interface Assignment extends Omit<HomeworkTask, 'dueDate'> {
  dueDate: string | null;
  dueTime?: string;
  description: string;
  source: string;
  addedAt: string;
  moodleUrl?: string;
  isCompleted?: boolean;
}

export type StatusFilter = 'ALL' | 'COMPLETED' | 'ACTIVE' | 'OVERDUE';

export type SortOrder = 'SOONEST' | 'LATEST' | 'TITLE';

export type MarkSource = 'SYSTEM' | 'USER';

export type MarkFilter = 'ALL' | MarkSource;

export type DeadlineState = 'overdue' | 'approaching' | 'normal';
