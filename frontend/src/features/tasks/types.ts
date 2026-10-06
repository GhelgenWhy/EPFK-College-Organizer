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
}
