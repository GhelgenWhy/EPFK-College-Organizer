import type { CalendarEvent } from '../../features/calendar/types';
import type { CollegeEvent } from '../../features/events/types';
import type { HomeData } from '../../features/home/types';
import type { ScheduleResponse } from '../../features/schedule/types';
import type { ApiRequestOptions } from './client';
import { requestJson } from './client';
import { array, boolean, dateKey, dateString, id, nullable, number, object, oneOf, optional, string, validated } from './validation';

const lesson = object({
  id: string, disciplineName: string, teacherName: string,
  startsAt: string, endsAt: string, format: oneOf('OFFLINE', 'ONLINE', 'HYBRID'),
  room: optional(nullable(string)), meetingUrl: optional(nullable(string)),
});
const day = object({
  weekday: number, name: string,
  lessons: (value) => Array.isArray(value) && value.length === 6 && value.every(nullable(lesson)),
});
const schedule = object({
  timeSlots: (value) => Array.isArray(value) && value.length === 6 && value.every(string),
  numerator: array(day), denominator: array(day),
});
const calendarEvent = object({
  id, title: string, date: dateKey, type: oneOf('DEADLINE', 'EVENT'),
  discipline: optional(string), description: optional(string), linkUrl: optional(string), time: optional(string),
});
const collegeEvent = object({
  id, title: string, date: dateKey, time: string,
  status: oneOf('Заплановано', 'Перенесено', 'Завершено'),
  location: string, description: string, organizer: string, site: string, createdAt: string,
});
interface HomeResponse {
  HOME_DEMO_DATE: string;
  HOME_DEADLINES: HomeData['deadlines'];
  HOME_EVENTS: HomeData['events'];
  HOME_LESSONS: HomeData['lessons'];
  HOME_TASKS: HomeData['tasks'];
}
const home = object({
  HOME_DEMO_DATE: dateString,
  HOME_DEADLINES: array(object({ id: string, date: dateKey, label: string, title: string, course: string, urgent: optional(boolean) })),
  HOME_EVENTS: array(object({ id: string, date: dateKey, monthLabel: string, title: string, details: string })),
  HOME_LESSONS: array(object({ id: string, startsAt: string, endsAt: string, title: string, teacher: string, location: string, meetingUrl: optional(string) })),
  HOME_TASKS: array(object({ id: string, title: string, course: string, dueDate: dateKey })),
});

export const organizerApi = {
  getSchedule: (options: ApiRequestOptions) => requestJson('/api/schedule', options,
    (value) => validated<ScheduleResponse>(value, schedule, 'schedule')),
  getCalendar: (options: ApiRequestOptions) => requestJson('/api/calendar', options,
    (value) => validated<CalendarEvent[]>(value, array(calendarEvent), 'calendar')),
  getEvents: (options: ApiRequestOptions) => requestJson('/api/events', options,
    (value) => validated<CollegeEvent[]>(value, array(collegeEvent), 'events')),
  getHome: (options: ApiRequestOptions) => requestJson('/api/home', options, (value): HomeData => {
    const data = validated<HomeResponse>(value, home, 'home');
    return {
      date: new Date(data.HOME_DEMO_DATE), deadlines: data.HOME_DEADLINES,
      events: data.HOME_EVENTS, lessons: data.HOME_LESSONS, tasks: data.HOME_TASKS,
    };
  }),
};
