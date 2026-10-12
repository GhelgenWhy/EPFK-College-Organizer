import type { Discipline } from '../features/disciplines/types';

// Temporary catalog until disciplines are provided by the backend.
export const MOCK_DISCIPLINES: Discipline[] = [
  { id: 'machine-learning', name: 'Машинне навчання та штучний інтелект', teacherName: 'Котов Р.О.', moodleUrl: 'https://moodle.org' },
  { id: 'databases', name: 'Бази даних', teacherName: 'Мельник А.С.', moodleUrl: 'https://moodle.org' },
  { id: 'programming', name: 'Основи програмування', teacherName: 'Коваль О.О.', moodleUrl: 'https://moodle.org' },
  { id: 'higher-mathematics', name: 'Вища математика', teacherName: 'Бондаренко Н.М.', moodleUrl: null },
  { id: 'discrete-mathematics', name: 'Дискретна математика', teacherName: 'Шевченко І.В.', moodleUrl: null },
  { id: 'algorithms', name: 'Алгоритми та структури даних', teacherName: 'Коваль О.О.', moodleUrl: 'https://moodle.org' },
  { id: 'web-development', name: 'Веброзробка', teacherName: 'Петренко М.В.', moodleUrl: null },
  { id: 'english', name: 'Англійська мова', teacherName: 'Іваненко Т.П.', moodleUrl: null },
];
