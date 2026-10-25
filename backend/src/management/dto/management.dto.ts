import { BadRequestException } from '@nestjs/common';

export const WEEK_TYPES = ['numerator', 'denominator'] as const;
export type WeekType = (typeof WEEK_TYPES)[number];

export const LESSON_FORMATS = ['OFFLINE', 'ONLINE', 'HYBRID'] as const;
export type LessonFormat = (typeof LESSON_FORMATS)[number];

export interface CreateGroupDto {
  groupName: string;
}

export interface AssignGroupDto {
  groupId: number | null;
}

export interface UpsertLessonDto {
  weekType: WeekType;
  weekday: number;
  slot: number;
  disciplineName: string;
  teacherName: string;
  location?: string | null;
  format?: LessonFormat;
  meetingLink?: string | null;
  startsAt?: string;
  endsAt?: string;
}

export interface CreateTaskDto {
  disciplineId: number;
  taskName: string;
  description?: string;
  deadline?: string | null;
}

export interface UpdateTaskDto {
  taskName?: string;
  description?: string | null;
  deadline?: string | null;
}

export interface CreateEventDto {
  eventName: string;
  startTime: string;
  place?: string;
  description?: string;
  /** Optional organizer name typed by the admin (not the author's account name). */
  organizer?: string;
  /** Optional link to details or a registration form. */
  detailsUrl?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new BadRequestException(`Поле «${field}» є обов'язковим`);
  }
  return value.trim();
}

function optionalString(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function optionalDate(value: unknown): Date | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new BadRequestException('Некоректна дата');
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new BadRequestException('Некоректна дата');
  return parsed;
}

function requiredDate(value: unknown, field: string): Date {
  const parsed = optionalDate(value);
  if (!parsed) throw new BadRequestException(`Поле «${field}» є обов'язковим`);
  return parsed;
}

function integerInRange(value: unknown, field: string, min: number, max: number): number {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || !Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new BadRequestException(`Поле «${field}» має бути цілим числом від ${min} до ${max}`);
  }
  return parsed;
}

export function parseGroup(body: unknown): CreateGroupDto {
  const value = (body ?? {}) as Record<string, unknown>;
  return { groupName: requiredString(value.groupName, 'groupName') };
}

export function parseAssignGroup(body: unknown): AssignGroupDto {
  const value = (body ?? {}) as Record<string, unknown>;
  if (value.groupId === null || value.groupId === undefined) return { groupId: null };
  return { groupId: integerInRange(value.groupId, 'groupId', 1, Number.MAX_SAFE_INTEGER) };
}

export function parseLesson(body: unknown): UpsertLessonDto {
  const value = (body ?? {}) as Record<string, unknown>;
  const weekType = value.weekType;
  if (typeof weekType !== 'string' || !WEEK_TYPES.includes(weekType as WeekType)) {
    throw new BadRequestException('weekType має бути numerator або denominator');
  }
  const format = value.format;
  if (format !== undefined && !LESSON_FORMATS.includes(format as LessonFormat)) {
    throw new BadRequestException('Некоректний формат заняття');
  }
  return {
    weekType: weekType as WeekType,
    weekday: integerInRange(value.weekday, 'weekday', 1, 6),
    slot: integerInRange(value.slot, 'slot', 0, 5),
    disciplineName: requiredString(value.disciplineName, 'disciplineName'),
    teacherName: requiredString(value.teacherName, 'teacherName'),
    location: optionalString(value.location),
    format: (format as LessonFormat | undefined) ?? 'OFFLINE',
    meetingLink: optionalString(value.meetingLink),
    startsAt: optionalString(value.startsAt) ?? undefined,
    endsAt: optionalString(value.endsAt) ?? undefined,
  };
}

export function parseCreateTask(body: unknown): CreateTaskDto {
  const value = (body ?? {}) as Record<string, unknown>;
  return {
    disciplineId: integerInRange(value.disciplineId, 'disciplineId', 1, Number.MAX_SAFE_INTEGER),
    taskName: requiredString(value.taskName, 'taskName'),
    description: optionalString(value.description) ?? undefined,
    deadline: optionalDate(value.deadline)?.toISOString() ?? null,
  };
}

export function parseUpdateTask(body: unknown): UpdateTaskDto {
  const value = (body ?? {}) as Record<string, unknown>;
  const result: UpdateTaskDto = {};
  if (value.taskName !== undefined) result.taskName = requiredString(value.taskName, 'taskName');
  if (value.description !== undefined) result.description = optionalString(value.description);
  if (value.deadline !== undefined) result.deadline = optionalDate(value.deadline)?.toISOString() ?? null;
  return result;
}

export function parseCreateEvent(body: unknown): CreateEventDto {
  const value = (body ?? {}) as Record<string, unknown>;
  return {
    eventName: requiredString(value.eventName, 'eventName'),
    startTime: requiredDate(value.startTime, 'startTime').toISOString(),
    place: optionalString(value.place) ?? undefined,
    description: optionalString(value.description) ?? undefined,
    organizer: optionalString(value.organizer) ?? undefined,
    detailsUrl: optionalString(value.detailsUrl) ?? undefined,
  };
}

export function parseUpdateEvent(body: unknown): UpdateEventDto {
  const value = (body ?? {}) as Record<string, unknown>;
  const result: UpdateEventDto = {};
  if (value.eventName !== undefined) result.eventName = requiredString(value.eventName, 'eventName');
  if (value.startTime !== undefined) result.startTime = requiredDate(value.startTime, 'startTime').toISOString();
  if (value.place !== undefined) result.place = optionalString(value.place) ?? undefined;
  if (value.description !== undefined) result.description = optionalString(value.description) ?? undefined;
  if (value.organizer !== undefined) result.organizer = optionalString(value.organizer) ?? undefined;
  if (value.detailsUrl !== undefined) result.detailsUrl = optionalString(value.detailsUrl) ?? undefined;
  return result;
}
