import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { createClerkClient } from '@clerk/backend';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import type { HomeroomScope } from '../auth/roles.service.js';
import type {
  CreateEventDto,
  CreateGroupDto,
  CreateTaskDto,
  UpdateEventDto,
  UpdateTaskDto,
  UpsertLessonDto,
  WeekType,
} from './dto/management.dto.js';

export interface StoredLesson {
  id: string;
  disciplineName: string;
  teacherName: string;
  location?: string | null;
  startsAt: string;
  endsAt: string;
  format: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  meetingLink?: string | null;
}

export interface StoredDay {
  weekday: number;
  name: string;
  lessons: (StoredLesson | null)[];
}

export interface StoredSchedule {
  timeSlots: string[];
  numerator: StoredDay[];
  denominator: StoredDay[];
}

// Default timetable is Monday to Friday. Saturday exists only when it has lessons,
// so it appears as an extra column on demand.
const DAY_NAMES = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
const WEEKDAYS_DEFAULT = 5;
const DEFAULT_TIME_SLOTS = [
  '8:00 - 9:20',
  '9:35 - 10:55',
  '11:25 - 12:45',
  '12:55 - 14:15',
  '14:30 - 15:50',
  '16:05 - 17:25',
];

const emptyDay = (weekday: number): StoredDay => ({
  weekday,
  name: DAY_NAMES[weekday - 1],
  lessons: [null, null, null, null, null, null],
});

function emptySchedule(): StoredSchedule {
  const days = (): StoredDay[] =>
    Array.from({ length: WEEKDAYS_DEFAULT }, (_, index) => emptyDay(index + 1));
  return { timeSlots: [...DEFAULT_TIME_SLOTS], numerator: days(), denominator: days() };
}

/** Has at least one lesson in any slot. */
function hasLessons(day: StoredDay): boolean {
  return day.lessons.some((lesson) => lesson !== null);
}

function normalizeSchedule(value: unknown): StoredSchedule {
  const base = emptySchedule();
  if (!value || typeof value !== 'object') return base;
  const stored = value as Partial<StoredSchedule>;
  if (Array.isArray(stored.timeSlots) && stored.timeSlots.length === 6) base.timeSlots = stored.timeSlots;
  for (const week of ['numerator', 'denominator'] as const) {
    const days = stored[week];
    if (!Array.isArray(days)) continue;
    const result = new Map<number, StoredDay>(base[week].map((day) => [day.weekday, day]));
    for (const incoming of days) {
      const weekday = Number(incoming?.weekday);
      if (!Number.isInteger(weekday) || weekday < 1 || weekday > DAY_NAMES.length) continue;
      if (!Array.isArray(incoming.lessons)) continue;
      const lessons: (StoredLesson | null)[] = [null, null, null, null, null, null];
      for (let slot = 0; slot < 6; slot += 1) {
        const lesson = incoming.lessons[slot];
        lessons[slot] = lesson && typeof lesson === 'object' ? (lesson as StoredLesson) : null;
      }
      result.set(weekday, { ...emptyDay(weekday), lessons });
    }
    // Saturday is kept only while it has lessons; empty Saturday is not shown.
    base[week] = [...result.values()]
      .filter((day) => day.weekday <= WEEKDAYS_DEFAULT || hasLessons(day))
      .sort((a, b) => a.weekday - b.weekday);
  }
  return base;
}

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------- groups

  async listGroups() {
    return this.prisma.group.findMany({
      orderBy: { groupName: 'asc' },
      select: {
        id: true,
        groupName: true,
        _count: { select: { users: true } },
        schedules: { select: { id: true }, take: 1 },
      },
    }).then((groups) =>
      groups.map((group) => ({
        id: group.id,
        groupName: group.groupName,
        studentCount: group._count.users,
        scheduleId: group.schedules[0]?.id ?? null,
      })),
    );
  }

  async createGroup(dto: CreateGroupDto) {
    const existing = await this.prisma.group.findUnique({ where: { groupName: dto.groupName } });
    if (existing) throw new ConflictException('Група з такою назвою вже існує');
    return this.prisma.group.create({ data: { groupName: dto.groupName } });
  }

  async deleteGroup(groupId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { _count: { select: { users: true } } },
    });
    if (!group) throw new NotFoundException('Групу не знайдено');
    if (group._count.users > 0) {
      throw new ConflictException('Спочатку переведіть студентів з цієї групи');
    }
    await this.prisma.$transaction([
      this.prisma.schedule.deleteMany({ where: { groupId } }),
      this.prisma.group.delete({ where: { id: groupId } }),
    ]);
    return { deleted: true };
  }

  // --------------------------------------------------------------- students

  async listStudents(scope: HomeroomScope, groupId?: number) {
    const where =
      scope.user.role === 'admin'
        ? groupId
          ? { groupId }
          : {}
        : { groupId: { in: scope.groupIds } };
    const students = await this.prisma.user.findMany({
      where,
      orderBy: [{ groupId: 'asc' }],
      select: {
        id: true,
        token: true,
        lastSync: true,
        group: { select: { id: true, groupName: true } },
        _count: { select: { tasks: true, disciplines: true } },
      },
    });
    const names = await this.resolveNames(students.map((student) => student.id));
    return students.map((student) => ({
      id: student.id,
      firstName: names.get(student.id)?.firstName ?? null,
      lastName: names.get(student.id)?.lastName ?? null,
      email: names.get(student.id)?.email ?? null,
      groupId: student.group?.id ?? null,
      groupName: student.group?.groupName ?? null,
      lastSync: student.lastSync,
      moodleLinked: Boolean(student.token),
      taskCount: student._count.tasks,
      disciplineCount: student._count.disciplines,
    }));
  }

  /**
   * Looks up the display name and primary email in Clerk in one request.
   * A Clerk outage must not break the list, so failures return an empty map.
   */
  private async resolveNames(userIds: string[]) {
    const result = new Map<string, { firstName: string | null; lastName: string | null; email: string | null }>();
    if (userIds.length === 0) return result;
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) return result;
    try {
      const clerk = createClerkClient({ secretKey });
      const page = await clerk.users.getUserList({ userId: userIds, limit: userIds.length });
      for (const user of page.data) {
        result.set(user.id, {
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          email: user.primaryEmailAddress?.emailAddress ?? null,
        });
      }
    } catch {
      // Names are informational; the list still works with ids.
    }
    return result;
  }

  async assignGroup(scope: HomeroomScope, userId: string, groupId: number | null) {
    const student = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!student) throw new NotFoundException('Студента не знайдено');
    if (groupId !== null) {
      const group = await this.prisma.group.findUnique({ where: { id: groupId } });
      if (!group) throw new NotFoundException('Групу не знайдено');
      if (scope.user.role !== 'admin' && !scope.groupIds.includes(groupId)) {
        throw new BadRequestException('Староста може керувати лише своєю групою');
      }
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { groupId },
      select: { id: true, group: { select: { id: true, groupName: true } } },
    });
    return { id: updated.id, groupId: updated.group?.id ?? null, groupName: updated.group?.groupName ?? null };
  }

  // -------------------------------------------------------------- schedule

  /** Returns the stored schedule JSON for a group, creating it on demand. */
  private async loadGroupSchedule(groupId: number) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Групу не знайдено');
    let schedule = await this.prisma.schedule.findFirst({ where: { groupId } });
    if (!schedule) {
      schedule = await this.prisma.schedule.create({
        data: { groupId, schedule: emptySchedule() as never },
      });
    }
    return { scheduleId: schedule.id, data: normalizeSchedule(schedule.schedule) };
  }

  async readGroupSchedule(groupId: number) {
    const { scheduleId, data } = await this.loadGroupSchedule(groupId);
    return { scheduleId, groupId, schedule: data };
  }

  async upsertLesson(groupId: number, dto: UpsertLessonDto) {
    const { scheduleId, data } = await this.loadGroupSchedule(groupId);
    const week = data[dto.weekType];
    let day = week.find((candidate) => candidate.weekday === dto.weekday);
    if (!day) {
      // Saturday (and any other day) is created on demand when the first lesson is added.
      day = emptyDay(dto.weekday);
      week.push(day);
      week.sort((a, b) => a.weekday - b.weekday);
    }

    const [from, to] = (data.timeSlots[dto.slot] ?? '').split(' - ');
    const lesson: StoredLesson = {
      id: day.lessons[dto.slot]?.id ?? randomUUID(),
      disciplineName: dto.disciplineName,
      teacherName: dto.teacherName,
      location: dto.location ?? null,
      startsAt: dto.startsAt ?? (from ?? '').trim(),
      endsAt: dto.endsAt ?? (to ?? '').trim(),
      format: dto.format ?? 'OFFLINE',
      meetingLink: dto.meetingLink ?? null,
    };
    day.lessons[dto.slot] = lesson;
    await this.prisma.schedule.update({
      where: { id: scheduleId },
      data: { schedule: data as never },
    });
    return lesson;
  }

  async removeLesson(groupId: number, weekType: WeekType, weekday: number, slot: number) {
    const { scheduleId, data } = await this.loadGroupSchedule(groupId);
    const day = data[weekType].find((candidate) => candidate.weekday === weekday);
    if (!day || !day.lessons[slot]) throw new NotFoundException('Заняття не знайдено');
    day.lessons[slot] = null;
    await this.prisma.schedule.update({ where: { id: scheduleId }, data: { schedule: data as never } });
    return { deleted: true };
  }

  // ------------------------------------------------------------------ tasks

  async listDisciplines(scope: HomeroomScope) {
    if (scope.user.role === 'admin') {
      return this.prisma.discipline.findMany({
        orderBy: { disciplineName: 'asc' },
        select: { id: true, disciplineName: true, teacher: true, moodleId: true },
      });
    }
    const groupUsers = await this.prisma.user.findMany({
      where: { groupId: { in: scope.groupIds } },
      select: { id: true },
    });
    return this.prisma.discipline.findMany({
      where: { users: { some: { userId: { in: groupUsers.map((user) => user.id) } } } },
      orderBy: { disciplineName: 'asc' },
      select: { id: true, disciplineName: true, teacher: true, moodleId: true },
    });
  }

  async listGroupTasks(groupId: number) {
    const groupUsers = await this.prisma.user.findMany({
      where: { groupId },
      select: { id: true },
    });
    return this.prisma.task.findMany({
      where: { discipline: { users: { some: { userId: { in: groupUsers.map((user) => user.id) } } } } },
      orderBy: [{ deadline: 'asc' }],
      select: {
        id: true,
        taskName: true,
        description: true,
        deadline: true,
        addedAt: true,
        cmid: true,
        moodleId: true,
        discipline: { select: { id: true, disciplineName: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async createTask(disciplineId: number, dto: CreateTaskDto) {
    const discipline = await this.prisma.discipline.findUnique({ where: { id: disciplineId } });
    if (!discipline) throw new NotFoundException('Дисципліну не знайдено');
    // Local tasks get negative moodle ids so they never clash with Moodle sync data.
    const min = await this.prisma.task.aggregate({ where: { moodleId: { lt: 0 } }, _min: { moodleId: true } });
    const nextId = (min._min.moodleId ?? 0) - 1;
    return this.prisma.task.create({
      data: {
        moodleId: nextId,
        cmid: nextId,
        taskName: dto.taskName,
        description: dto.description ?? null,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        disciplineId: discipline.id,
      },
    });
  }

  async updateTask(taskId: number, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Завдання не знайдено');
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(dto.taskName !== undefined ? { taskName: dto.taskName } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.deadline !== undefined ? { deadline: dto.deadline ? new Date(dto.deadline) : null } : {}),
      },
    });
  }

  async deleteTask(taskId: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Завдання не знайдено');
    await this.prisma.task.delete({ where: { id: taskId } });
    return { deleted: true };
  }

  // ----------------------------------------------------------------- events

  async listEvents() {
    return this.prisma.event.findMany({ orderBy: { startTime: 'asc' } });
  }

  async createEvent(dto: CreateEventDto, owner: string) {
    return this.prisma.event.create({
      data: {
        owner,
        eventName: dto.eventName,
        startTime: new Date(dto.startTime),
        place: dto.place ?? null,
        description: dto.description ?? null,
      },
    });
  }

  async updateEvent(eventId: number, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Подію не знайдено');
    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...(dto.eventName !== undefined ? { eventName: dto.eventName } : {}),
        ...(dto.startTime !== undefined ? { startTime: new Date(dto.startTime) } : {}),
        ...(dto.place !== undefined ? { place: dto.place ?? null } : {}),
        ...(dto.description !== undefined ? { description: dto.description ?? null } : {}),
      },
    });
  }

  async deleteEvent(eventId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Подію не знайдено');
    await this.prisma.event.delete({ where: { id: eventId } });
    return { deleted: true };
  }

  // ------------------------------------------------------------------- me

  /** Groups a student may choose from: names only, created by admins. */
  async listGroupOptions() {
    return this.prisma.group.findMany({
      orderBy: { groupName: 'asc' },
      select: { id: true, groupName: true },
    });
  }

  /**
   * Lets a user pick their own group, but only one that already exists.
   * Students cannot create groups; the admin assigns anything else.
   */
  async chooseOwnGroup(user: AuthenticatedUser, groupId: number) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Групу не знайдено');
    await this.prisma.user.upsert({
      where: { id: user.userId },
      create: { id: user.userId, groupId },
      update: { groupId },
    });
    return { groupId: group.id, groupName: group.groupName };
  }

  async getMe(user: AuthenticatedUser) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { group: { select: { id: true, groupName: true } }, lastSync: true },
    });
    return {
      userId: user.userId,
      role: user.role,
      groupId: dbUser?.group?.id ?? null,
      groupName: dbUser?.group?.groupName ?? null,
      lastSync: dbUser?.lastSync ?? null,
    };
  }
}
