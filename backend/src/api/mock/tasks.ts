import type { HomeworkTask } from '../types/tasks.js';

export const HOME_TASKS: HomeworkTask[] = [
  {
    id: 'presentation',
    title: 'Підготувати презентацію',
    course: 'Інформаційні технології',
    dueDate: '2026-10-02',
  },
  {
    id: 'database-topic',
    title: 'Опрацювати тему 6',
    course: 'Бази даних',
    dueDate: '2026-10-03',
  },
  {
    id: 'ml-lab',
    title: 'Завершити лабораторну № 3',
    course: 'Машинне навчання',
    dueDate: '2026-10-04',
  },
];