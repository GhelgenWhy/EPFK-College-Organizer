import { HOME_TASKS } from '../tasks/mockData';
import type { CollegeEvent, HomeDeadline, HomeLesson } from './types';

export { HOME_TASKS };

// The export contained a static September 30 snapshot, so this content is for
// preview purposes until the application has live data from its API.
export const HOME_DEMO_DATE = new Date(2026, 8, 30);

export const HOME_LESSONS: HomeLesson[] = [
  {
    id: 'programming-basics',
    startsAt: '09:35',
    endsAt: '10:55',
    title: 'Основи програмування',
    teacher: 'Олександр Коваль',
    location: 'Аудиторія 214',
  },
  {
    id: 'machine-learning',
    startsAt: '11:25',
    endsAt: '12:45',
    title: 'Машинне навчання та штучний інтелект',
    teacher: 'Роман Котов',
    location: 'Онлайн · Google Meet',
    meetingUrl: 'https://meet.google.com',
  },
  {
    id: 'databases',
    startsAt: '12:55',
    endsAt: '14:15',
    title: 'Бази даних',
    teacher: 'Анастасія Мельник',
    location: 'Аудиторія 305',
  },
  {
    id: 'english',
    startsAt: '14:30',
    endsAt: '15:50',
    title: 'Англійська мова',
    teacher: 'Наталія Шевченко',
    location: 'Аудиторія 118',
  },
];

export const HOME_EVENTS: CollegeEvent[] = [
  {
    id: 'open-day',
    date: '2026-10-02',
    monthLabel: 'ЖОВ',
    title: 'День відкритих дверей',
    details: 'Актова зала · 14:00',
  },
  {
    id: 'careers-meetup',
    date: '2026-10-05',
    monthLabel: 'ЖОВ',
    title: 'Зустріч із роботодавцями',
    details: 'Конференц-зала · 12:00',
  },
];

export const HOME_DEADLINES: HomeDeadline[] = [
  {
    id: 'ml-report',
    date: '2026-09-30',
    label: 'СЬОГОДНІ · 23:59',
    title: 'Звіт з машинного навчання',
    course: 'Машинне навчання',
    urgent: true,
  },
  {
    id: 'database-practice',
    date: '2026-10-01',
    label: 'ЗАВТРА · 18:00',
    title: 'Практична робота № 4',
    course: 'Бази даних',
  },
  {
    id: 'programming-test',
    date: '2026-10-03',
    label: '3 ЖОВТНЯ · 23:59',
    title: 'Модульний тест',
    course: 'Основи програмування',
  },
];
