import type { Assignment } from './types';

// Static assignment snapshot transcribed from the supplied screen design.
export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'sorting-algorithm',
    title: 'Реалізувати алгоритм сортування',
    course: 'Алгоритми та структури даних',
    description: 'Порівняйте швидкодію алгоритмів на масиві з 10 000 елементів. Додайте короткий висновок до звіту.',
    dueDate: '2026-09-25',
    dueTime: '23:59',
    source: 'Moodle',
    addedAt: '21.09.2026',
    moodleUrl: 'https://moodle.org/',
  },
  {
    id: 'machine-learning-lab-4',
    title: 'Лабораторна робота № 4 — машинне навчання',
    course: 'Машинне навчання та штучний інтелект',
    description: 'Навчити модель класифікації, оцінити точність на тестовій вибірці та додати графік результатів.',
    dueDate: '2026-10-21',
    dueTime: '23:01',
    source: 'Moodle',
    addedAt: '21.09.2026',
    moodleUrl: 'https://moodle.org/',
  },
  {
    id: 'digital-transformation-essay',
    title: 'Підготувати есе про цифрову трансформацію освіти',
    course: 'Українська мова та професійна комунікація',
    description: 'Обсяг 2–3 сторінки. Додайте список використаних джерел і надішліть файл у форматі PDF.',
    dueDate: '2026-09-30',
    dueTime: '18:00',
    source: 'Moodle',
    addedAt: '21.09.2026',
  },
  {
    id: 'database-practice-4',
    title: 'Практична робота: бази даних',
    course: 'Проєктування баз даних',
    description: 'Створіть схему таблиць і налаштуйте зв’язки. Опишіть нормалізацію отриманої структури.',
    dueDate: null,
    source: 'Moodle',
    addedAt: '21.09.2026',
    moodleUrl: 'https://moodle.org/',
  },
];

export const ASSIGNMENTS_SNAPSHOT_DATE = new Date(2026, 8, 21);
