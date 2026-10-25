import {
  fetchWithClerkAuth,
  requestJson,
  ApiError,
  type ApiRequestOptions,
} from './client';
import {
  array,
  nullable,
  number,
  object,
  optional,
  string,
  validated,
} from './validation';

export interface CurrentUserProfile {
  userId: string;
  role: 'student' | 'starosta' | 'admin';
  groupId: number | null;
  groupName: string | null;
  lastSync: string | null;
}

export interface GroupInfo {
  id: number;
  groupName: string;
  studentCount: number;
  scheduleId: number | null;
}

export interface StudentInfo {
  id: string;
  /** Display name from Clerk; null when it could not be resolved. */
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  groupId: number | null;
  groupName: string | null;
  lastSync: string | null;
  moodleLinked: boolean;
  taskCount: number;
  disciplineCount: number;
}

export interface AssignmentRow {
  id: number;
  taskName: string;
  description: string | null;
  deadline: string | null;
  addedAt: string;
  discipline: { id: number; disciplineName: string };
}

export interface DisciplineOption {
  id: number;
  disciplineName: string;
  teacher: string;
}

export interface EventRow {
  id: number;
  owner: string;
  eventName: string;
  startTime: string;
  place: string | null;
  description: string | null;
  organizer: string | null;
  detailsUrl: string | null;
}

/** Payload for creating or editing a college event. Organizer and details link are optional. */
export interface EventPayload {
  eventName?: string;
  startTime?: string;
  place?: string;
  description?: string;
  organizer?: string;
  detailsUrl?: string;
}

export type WeekType = 'numerator' | 'denominator';

export interface LessonSlot {
  id: string;
  disciplineName: string;
  teacherName: string;
  location?: string | null;
  startsAt: string;
  endsAt: string;
  format: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  meetingLink?: string | null;
}

export interface StoredSchedule {
  timeSlots: string[];
  numerator: Array<{ weekday: number; name: string; lessons: Array<LessonSlot | null> }>;
  denominator: Array<{ weekday: number; name: string; lessons: Array<LessonSlot | null> }>;
}

export interface GroupSchedule {
  scheduleId: number;
  groupId: number;
  schedule: StoredSchedule;
}

const meCheck = object({
  userId: string,
  role: (value) => value === 'student' || value === 'starosta' || value === 'admin',
  groupId: nullable(number),
  groupName: nullable(string),
  lastSync: nullable(string),
});

const groupCheck = object({
  id: number,
  groupName: string,
  studentCount: number,
  scheduleId: nullable(number),
});

const studentCheck = object({
  id: string,
  firstName: nullable(string),
  lastName: nullable(string),
  email: nullable(string),
  groupId: nullable(number),
  groupName: nullable(string),
  lastSync: nullable(string),
  moodleLinked: optional((value) => typeof value === 'boolean'),
  taskCount: optional(number),
  disciplineCount: optional(number),
});

const taskCheck = object({
  id: number,
  taskName: string,
  description: nullable(string),
  deadline: nullable(string),
  addedAt: (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value)),
  discipline: object({ id: number, disciplineName: string }),
});

const disciplineCheck = object({
  id: number,
  disciplineName: string,
  teacher: string,
});

const eventCheck = object({
  id: number,
  owner: optional(string),
  eventName: string,
  startTime: (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value)),
  place: nullable(string),
  description: nullable(string),
  organizer: optional(nullable(string)),
  detailsUrl: optional(nullable(string)),
});

async function send(
  path: string,
  method: string,
  body: unknown,
  { getToken, signal }: ApiRequestOptions,
): Promise<void> {
  const response = await fetchWithClerkAuth(getToken, path, {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: unknown } | null;
    const message = Array.isArray(payload?.message)
      ? payload?.message.join(', ')
      : typeof payload?.message === 'string'
        ? payload.message
        : `Запит ${method} ${path} не виконано (${response.status})`;
    throw new ApiError(response.status, message);
  }
}

export const manageApi = {
  getMe: (options: ApiRequestOptions) =>
    requestJson('/manage/me', options, (value) => validated<CurrentUserProfile>(value, meCheck, 'me')),

  /** Existing groups the user may pick from (no creation). */
  getGroupOptions: (options: ApiRequestOptions) =>
    requestJson('/manage/group-options', options, (value) =>
      validated<Array<{ id: number; groupName: string }>>(
        value,
        array(object({ id: number, groupName: string })),
        'group options',
      )),

  /** Admin forces a Moodle sync for one student using the token they already linked. */
  syncStudent: async (userId: string, options: ApiRequestOptions) => {
    await send(`/manage/admin/students/${encodeURIComponent(userId)}/sync`, 'POST', undefined, options);
  },

  /** The user selects one of the existing groups for themselves. */
  chooseOwnGroup: async (groupId: number, options: ApiRequestOptions) => {
    await send('/manage/me/group', 'PUT', { groupId }, options);
  },

  // groups
  getGroups: (options: ApiRequestOptions) =>
    requestJson('/manage/admin/groups', options, (value) =>
      validated<GroupInfo[]>(value, array(groupCheck), 'groups')),
  createGroup: async (groupName: string, options: ApiRequestOptions) => {
    await send('/manage/admin/groups', 'POST', { groupName }, options);
  },
  renameGroup: async (groupId: number, groupName: string, options: ApiRequestOptions) => {
    await send(`/manage/admin/groups/${groupId}`, 'PATCH', { groupName }, options);
  },
  deleteGroup: async (groupId: number, options: ApiRequestOptions) => {
    await send(`/manage/admin/groups/${groupId}`, 'DELETE', undefined, options);
  },

  // students
  getStudents: (options: ApiRequestOptions, groupId?: number) =>
    requestJson(
      groupId ? `/manage/admin/students?groupId=${groupId}` : '/manage/admin/students',
      options,
      (value) => validated<StudentInfo[]>(value, array(studentCheck), 'students'),
    ),
  getOwnStudents: (options: ApiRequestOptions) =>
    requestJson('/manage/students', options, (value) =>
      validated<StudentInfo[]>(value, array(studentCheck), 'students')),
  assignGroup: async (userId: string, groupId: number | null, options: ApiRequestOptions) => {
    await send(`/manage/admin/students/${encodeURIComponent(userId)}/group`, 'PATCH', { groupId }, options);
  },

  // schedule
  getGroupSchedule: (options: ApiRequestOptions, groupId: number) =>
    requestJson(`/manage/groups/${groupId}/schedule`, options, (value) =>
      validated<GroupSchedule>(value, object({
        scheduleId: number,
        groupId: number,
        schedule: object({
          timeSlots: array(string),
          numerator: array((day) => (object({ weekday: number, name: string, lessons: array((lesson) => lesson === null || typeof lesson === 'object') }))(day)),
          denominator: array((day) => (object({ weekday: number, name: string, lessons: array((lesson) => lesson === null || typeof lesson === 'object') }))(day)),
        }),
      }), 'schedule')),
  saveLesson: async (
    groupId: number,
    lesson: {
      weekType: WeekType; weekday: number; slot: number;
      disciplineName: string; teacherName: string;
      location?: string | null; format?: 'OFFLINE' | 'ONLINE' | 'HYBRID'; meetingLink?: string | null;
    },
    options: ApiRequestOptions,
  ) => {
    await send(`/manage/groups/${groupId}/schedule/lesson`, 'PUT', lesson, options);
  },
  deleteLesson: async (
    groupId: number,
    weekType: WeekType,
    weekday: number,
    slot: number,
    options: ApiRequestOptions,
  ) => {
    await send(
      `/manage/groups/${groupId}/schedule/lesson?weekType=${weekType}&weekday=${weekday}&slot=${slot}`,
      'DELETE',
      undefined,
      options,
    );
  },

  // tasks
  getDisciplines: (options: ApiRequestOptions) =>
    requestJson('/manage/disciplines', options, (value) =>
      validated<DisciplineOption[]>(value, array(disciplineCheck), 'disciplines')),
  getGroupTasks: (options: ApiRequestOptions, groupId: number) =>
    requestJson(`/manage/groups/${groupId}/tasks`, options, (value) =>
      validated<AssignmentRow[]>(value, array(taskCheck), 'tasks')),
  createTask: async (
    payload: { disciplineId: number; taskName: string; description?: string; deadline?: string | null },
    options: ApiRequestOptions,
  ) => {
    await send('/manage/tasks', 'POST', payload, options);
  },
  updateTask: async (
    taskId: number,
    payload: { taskName?: string; description?: string | null; deadline?: string | null },
    options: ApiRequestOptions,
  ) => {
    await send(`/manage/tasks/${taskId}`, 'PATCH', payload, options);
  },
  deleteTask: async (taskId: number, options: ApiRequestOptions) => {
    await send(`/manage/tasks/${taskId}`, 'DELETE', undefined, options);
  },

  // events
  getEvents: (options: ApiRequestOptions) =>
    requestJson('/manage/events', options, (value) =>
      validated<EventRow[]>(value, array(eventCheck), 'events')),
  createEvent: async (
    payload: EventPayload & { eventName: string; startTime: string },
    options: ApiRequestOptions,
  ) => {
    await send('/manage/events', 'POST', payload, options);
  },
  updateEvent: async (
    eventId: number,
    payload: EventPayload,
    options: ApiRequestOptions,
  ) => {
    await send(`/manage/events/${eventId}`, 'PATCH', payload, options);
  },
  deleteEvent: async (eventId: number, options: ApiRequestOptions) => {
    await send(`/manage/events/${eventId}`, 'DELETE', undefined, options);
  },
};
