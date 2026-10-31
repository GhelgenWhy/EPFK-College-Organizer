import type { CalendarEvent } from '../../features/calendar/types';
import type { CollegeEvent } from '../../features/events/types';
import type { HomeData } from '../../features/home/types';
import type { ScheduleResponse } from '../../features/schedule/types';
import type { ApiRequestOptions } from './client';
import { requestJson } from './client';
import { array, boolean, dateKey, dateString, id, nullable, number, object, oneOf, optional, string, validated } from './validation';

// One malformed lesson must not hide the whole timetable: unknown lessons become empty slots.
const lesson = object({
  id: id, disciplineName: string, teacherName: string,
  startsAt: string, endsAt: string, format: oneOf('OFFLINE', 'ONLINE', 'HYBRID'),
  location: optional(nullable(string)), meetingLink: optional(nullable(string)),
});
const day = object({
  weekday: number, name: string,
  lessons: (value) => Array.isArray(value) && value.length === 6,
});
const schedule = object({
  timeSlots: (value) => Array.isArray(value) && value.length === 6,
  numerator: array(day), denominator: array(day),
});

/** Replaces malformed lesson entries with `null` so the grid keeps its six slots. */
function normalizeSchedule(value: ScheduleResponse): ScheduleResponse {
  const days = (list: ScheduleResponse['numerator']) =>
    list.map((item) => ({
      ...item,
      lessons: item.lessons.map((entry) => (lesson(entry) ? entry : null)) as ScheduleResponse['numerator'][number]['lessons'],
    }));
  return { ...value, numerator: days(value.numerator), denominator: days(value.denominator) };
}
const calendarEvent = object({
  id, title: string, date: dateKey, type: oneOf('DEADLINE', 'EVENT'),
  discipline: optional(string), description: optional(string), linkUrl: optional(nullable(string)), time: optional(string),
});
const collegeEvent = object({
  id, title: string, date: dateKey, time: string,
  status: oneOf('Заплановано', 'Перенесено', 'Завершено'),
  location: string, description: string, organizer: string, detailsUrl: string, site: string, createdAt: string,
});
interface HomeResponse {
  HOME_DEMO_DATE: string;
  HOME_DEADLINES: HomeData['deadlines'] | null;
  HOME_EVENTS: HomeData['events'] | null;
  HOME_LESSONS: HomeData['lessons'] | null;
  HOME_TASKS: HomeData['tasks'] | null;
  HOME_SUMMARY?: HomeData['summary'] | null;
}
const nullableArray = (check: (value: unknown) => boolean) =>
  (value: unknown): boolean => value === null || value === undefined || array(check)(value);

// Backend may send null for missing lists or fields (weekends, no group, no deadline).
// Nullable lists are normalised to [] in getHome; nullable fields are rendered as text fallbacks.
const home = object({
  HOME_DEMO_DATE: dateString,
  HOME_DEADLINES: nullableArray(object({ id: string, date: dateKey, label: string, title: string, course: string, urgent: optional(boolean) })),
  HOME_EVENTS: nullableArray(object({ id: string, date: dateKey, monthLabel: string, title: string, details: string })),
  HOME_LESSONS: nullableArray(object({ id: string, startsAt: string, endsAt: string, title: string, teacher: string, location: string, meetingUrl: optional(nullable(string)) })),
  HOME_TASKS: nullableArray(object({ id: string, title: string, course: string, dueDate: dateKey })),
  HOME_SUMMARY: optional(nullable(object({ activeTasks: number, deadlinesNext3Days: number, overdueTasks: number }))),
});

export const organizerApi = {
  getSchedule: (options: ApiRequestOptions) => requestJson('/api/schedule', options,
    (value) => normalizeSchedule(validated<ScheduleResponse>(value, schedule, 'schedule'))),
  getCalendar: (options: ApiRequestOptions) => requestJson('/api/calendar', options,
    (value) => validated<CalendarEvent[]>(value, array(calendarEvent), 'calendar')),
  getEvents: (options: ApiRequestOptions) => requestJson('/api/events', options,
    (value) => validated<CollegeEvent[]>(value, array(collegeEvent), 'events')),
  getHome: (options: ApiRequestOptions) => requestJson('/api/home', options, (value): HomeData => {
    const data = validated<HomeResponse>(value, home, 'home');
    return {
      date: new Date(data.HOME_DEMO_DATE),
      deadlines: data.HOME_DEADLINES ?? [],
      events: data.HOME_EVENTS ?? [],
      lessons: data.HOME_LESSONS ?? [],
      tasks: data.HOME_TASKS ?? [],
      summary: data.HOME_SUMMARY ?? undefined,
    };
  }),
};
