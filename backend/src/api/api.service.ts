import { Injectable, Logger } from '@nestjs/common';

/** Name of the system group for students who have no real group. */
export const UNGROUPED_NAME = 'Без групи';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ScheduleDay, ScheduleLesson, ScheduleResponse } from './types/schedule.ts';
import type { HomeDeadline } from './types/home.ts';
import type { HomeworkTask } from './types/tasks.ts';
import { MoodleAuthError, MoodleService } from '../moodle/moodle.service.js';
import { ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

/** "9:35" or "09:35" → minutes from midnight. Unparseable values sort as the end of the day. */
function timeToMinutes(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return 24 * 60;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Minutes from midnight of the current day in Europe/Kyiv. */
function kyivMinutesOfDay(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
}

function getAcademicWeekType(targetDate: Date = new Date()): "numerator" | "denominator" {
  const currentYear: number = targetDate.getFullYear();
  const currentMonth: number = targetDate.getMonth();

  const startYear: number = currentMonth < 8 ? currentYear - 1 : currentYear;
  const sep1: Date = new Date(startYear, 8, 1);

  const getMonday = (date: Date): Date => {
      const day: number = date.getDay();
      const diff: number = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday: Date = new Date(date);
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      return monday;
  };

  const sep1Monday: Date = getMonday(sep1);
  const targetMonday: Date = getMonday(targetDate);

  const msInWeek: number = 1000 * 60 * 60 * 24 * 7;
  
  const weekNumber: number = Math.round((targetMonday.getTime() - sep1Monday.getTime()) / msInWeek) + 1;

  const weekType: "numerator" | "denominator" = weekNumber % 2 !== 0 ? "numerator" : "denominator";

  return weekType;
}
export interface Lesson {
  id: string
  disciplineName: string
  teacherName: string
  startsAt: string
  endsAt: string
  location: string
  meetingUrl: string
}

/** A lesson as the dashboard renders it (see frontend features/home/types.ts). */
export interface HomeLesson {
  id: string
  startsAt: string
  endsAt: string
  title: string
  teacher: string
  location: string
  meetingUrl?: string
}

export interface Day {
  weekday: number
  name: string
  lessons: Lesson[]
}

export interface Schedule {
  timeSlots: string[]
  numerator: Day[]
  denominator: Day[]
}

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  constructor(
    private readonly moodleService: MoodleService,
    private readonly prismaService: PrismaService
  ) {}
  private readonly schedule = JSON.parse(
    readFileSync(
      fileURLToPath(new URL('./mock/schedule.json', import.meta.url)),
      'utf8',
    ),
  ) as ScheduleResponse;

  /** College events created in the management page, mapped to the events list shape. */
  async getEvents() {
    const rows = await this.prismaService.event.findMany({ orderBy: { startTime: 'asc' } });
    const now = Date.now();
    return rows.map((event) => {
      const start = new Date(event.startTime);
      return {
        id: event.id,
        title: event.eventName,
        date: start.toISOString().slice(0, 10),
        time: start.toISOString().slice(11, 16),
        status: start.getTime() < now ? 'Завершено' : 'Заплановано',
        location: event.place ?? '',
        description: event.description ?? '',
        // Only what the admin typed; an empty organizer stays empty.
        organizer: event.organizer ?? '',
        detailsUrl: event.detailsUrl ?? '',
        site: '',
        createdAt: event.startTime.toISOString(),
      } as const;
    });
  }

  /** Upcoming college events for the dashboard, in the shape the home page expects. */
  async getUpcomingHomeEvents() {
    const events = await this.getEvents();
    const monthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    return events
      .filter((event) => event.status !== 'Завершено')
      .slice(0, 5)
      .map((event) => {
        const [, month, day] = event.date.split('-').map(Number);
        const details = [event.location, event.time].filter(Boolean).join(' · ');
        return {
          // The dashboard contract expects a string id (the Prisma id is a number).
          id: String(event.id),
          date: event.date,
          monthLabel: `${day} ${monthNames[month - 1]}`,
          title: event.title,
          details,
        };
      });
  }

  /** Calendar entries: the mock deadlines plus every stored college event as an EVENT. */
  async getCalendar(userId: string) {
    const [events, deadlines] = await Promise.all([this.getEvents(), this.getUserDeadlines(userId)]);
    const storedEvents = events.map((event) => ({
      id: `event-${event.id}`,
      title: event.title,
      date: event.date,
      type: 'EVENT' as const,
      time: event.time,
      description: event.description,
      linkUrl: event.detailsUrl || undefined,
    }));
    return [...deadlines, ...storedEvents];
  }

  async getCourses(userId: string) {
    const userDisciplines = await this.prismaService.discipline.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });
    return userDisciplines.map(course => ({
        id: course.moodleId,
        name: course.disciplineName,
        teacherName: course.teacher,
        moodleUrl: `https://epkmoodle.znu.edu.ua/course/view.php?id=${course.moodleId}`,
    }));
  }

  async getCourseAssignments(userId: string, courseId: number | string) {
    const parsedCourseId = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
    const userTasks = await this.prismaService.task.findMany({
      where: {
        discipline: { 
          moodleId: parsedCourseId,
          users: {
            some: { userId }
          }
        }
      },
      select: {
        id: true,
        moodleId: true,
        description: true,
        taskName: true,
        deadline: true,
        addedAt: true,
        cmid: true,
        discipline: { 
          select: { disciplineName: true } 
        },
        users: {
          where: { userId: userId },
          select: { isCompleted: true }
        }
      }
    });

    return userTasks.map(task => {
      const isCompleted = task.users[0]?.isCompleted ?? false;

      return {
        id: task.moodleId,
        title: task.taskName,
        course: task.discipline.disciplineName,
        description: task.description || '',
        dueDate: task.deadline ? task.deadline.toISOString() : null,
        dueTime: task.deadline 
          ? task.deadline.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) 
          : null,
        source: 'Moodle',
        addedAt: task.addedAt ? task.addedAt.toISOString() : undefined,
        moodleUrl: `https://epkmoodle.znu.edu.ua/mod/assign/view.php?id=${task.cmid}`,
        isCompleted: isCompleted
      };
    });
  }

  /** All of the user's assignments with a deadline, for the calendar (live from the database). */
  async getUserDeadlines(userId: string) {
    const tasks = await this.prismaService.task.findMany({
      where: {
        deadline: { not: null },
        discipline: { users: { some: { userId } } },
      },
      select: {
        moodleId: true,
        taskName: true,
        deadline: true,
        cmid: true,
        discipline: { select: { disciplineName: true } },
        users: { where: { userId }, select: { isCompleted: true } },
      },
      orderBy: { deadline: 'asc' },
    });
    return tasks.map((task) => {
      const due = task.deadline as Date;
      return {
        id: `task-${task.moodleId}`,
        title: task.taskName,
        date: due.toISOString().slice(0, 10),
        time: due.toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit' }),
        type: 'DEADLINE' as const,
        discipline: task.discipline.disciplineName,
        linkUrl: `https://epkmoodle.znu.edu.ua/mod/assign/view.php?id=${task.cmid}`,
        isCompleted: task.users[0]?.isCompleted ?? false,
      };
    });
  }

  async getHome(userId: string) {
    
    // HOME_DEADLINES ------------------------------------------------
    const homeDeadlinesDB = await this.prismaService.task.findMany({
        where: {
          deadline: {
            gt: new Date()
          }
        },
        take: 3,
        orderBy: {
          deadline: 'asc'
        },
        select: {
          id: true,
          taskName: true,
          deadline: true,
          discipline: { 
            select: { disciplineName: true } 
          },
        }
      });
    const safeDeadlines = homeDeadlinesDB.filter(
      (task): task is typeof task & { deadline: Date } => task.deadline !== null
    );
    const homeDeadlines: HomeDeadline[] = safeDeadlines.map(deadline => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const deadlineDateForLabel = new Date(deadline.deadline);
      deadlineDateForLabel.setHours(0, 0, 0, 0);

      const timeString = deadline.deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let urgent = false;

      let label = '';
      if (deadlineDateForLabel.getDate() === today.getDate()) {
        label = `СЬОГОДНІ · ${timeString}`;
        urgent = true;
      } else if (deadlineDateForLabel.getDate() === tomorrow.getDate()) {
        label = `ЗАВТРА · ${timeString}`;
      } else {
        label = `${deadline.deadline.toISOString().split('T')[0]} · ${timeString}`;
      }

      return {
        id: deadline.id.toString(),
        date: deadline.deadline.toISOString().split('T')[0], 
        label: label,
        title: deadline.taskName,
        course: deadline.discipline.disciplineName,
        urgent: urgent
      };
    });
    // ------------------------------------------------ HOME_DEADLINES

    // HOME_TASKS ----------------------------------------------------

    const homeTasksDB = await this.prismaService.task.findMany({
      where: {
        deadline: {
          gt: new Date()
        }
      },
      take: 3,
      orderBy: {
        deadline: 'asc'
      },
      select: {
        id: true,
        taskName: true,
        deadline: true,
        discipline: { 
          select: { disciplineName: true } 
        },
      }
    });

    const safeHomeTasks = homeTasksDB.filter(
      (task): task is typeof task & { deadline: Date } => task.deadline !== null
    );

    const homeTasks: HomeworkTask[] = safeHomeTasks.map(task => {
      return {
        id: task.id.toString(),
        course: task.discipline.disciplineName,
        dueDate: task.deadline.toISOString().split('T')[0],
        title: task.taskName
      }
    })

    // ---------------------------------------------------- HOME_TASKS

    // HOME_LESSONS --------------------------------------------------
    const today = new Date();
    const mondayBasedIndex = (today.getDay() + 6) % 7;

    // Weekends and users without a group/schedule get an empty list, never null.
    let homeLessons: HomeLesson[] = [];

    if (mondayBasedIndex < 5) {
      const scheduleDB = await this.prismaService.schedule.findFirst({
        where: {
          group: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      });

      const weekType = getAcademicWeekType();
      // Stored schedule uses ScheduleLesson (disciplineName, teacherName, meetingLink).
      const schedule = scheduleDB?.schedule as unknown as { numerator?: ScheduleDay[]; denominator?: ScheduleDay[] } | null | undefined;
      const lessons: (ScheduleLesson | null)[] = schedule?.[weekType]?.[mondayBasedIndex]?.lessons ?? [];

      // Dashboard contract: title/teacher/location/meetingUrl. Only lessons still ahead of now,
      // ordered by start time, so the first one is the "current or next" lesson.
      // Stored times are "H:mm" (no date), compared in minutes of the Kyiv day.
      const nowMinutes = kyivMinutesOfDay(new Date());
      homeLessons = lessons
        .filter((lesson): lesson is ScheduleLesson => lesson !== null)
        .filter((lesson) => timeToMinutes(lesson.endsAt) > nowMinutes)
        .sort((a, b) => timeToMinutes(a.startsAt) - timeToMinutes(b.startsAt))
        .map((lesson) => ({
          id: lesson.id,
          startsAt: lesson.startsAt,
          endsAt: lesson.endsAt,
          title: lesson.disciplineName,
          teacher: lesson.teacherName,
          location: lesson.location ?? '',
          meetingUrl: lesson.meetingLink ?? undefined,
        }));
    }
    // -------------------------------------------------- HOME_LESSONS

    return {
      HOME_DEMO_DATE: new Date(),
      HOME_DEADLINES: homeDeadlines,
      HOME_EVENTS: await this.getUpcomingHomeEvents(),
      HOME_LESSONS: homeLessons,
      HOME_TASKS: homeTasks
    };
  }
  getSchedule(user: { userId: string; role: string }) {
    return this.findUserSchedule(user.userId).then(
      (schedule) => schedule ?? this.schedule,
    );
  }

  /** Schedule of the user's own group, the same lookup the dashboard uses, for every role. */
  private async findUserSchedule(userId: string) {
    const stored = await this.prismaService.schedule.findFirst({
      where: { group: { users: { some: { id: userId } } } },
    });
    const value = stored?.schedule as unknown as Schedule | undefined;
    if (!value?.numerator || !value?.denominator) return null;
    // Stored JSON may miss lessons entries added by newer clients; normalize slots.
    // Monday to Friday are always shown; Saturday only when it has at least one lesson.
    const normalizeDays = (days: Day[]) =>
      days
        .map((day) => ({
          ...day,
          lessons: Array.from({ length: 6 }, (_, slot) => day.lessons?.[slot] ?? null),
        }))
        .filter((day) => day.weekday <= 5 || day.lessons.some((lesson) => lesson !== null));
    return {
      timeSlots: value.timeSlots,
      numerator: normalizeDays(value.numerator),
      denominator: normalizeDays(value.denominator),
    };
  }
  /**
   * Admin-triggered sync for one student using the Moodle token already stored for them.
   * Needs no password; a student without a stored token has to log in through the profile.
   */
  async syncStudentWithStoredToken(userId: string) {
    const stored = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { token: true },
    });
    if (!stored?.token) {
      throw new UnauthorizedException('Студент ще не підключив Moodle');
    }
    await this.syncWithToken(stored.token, userId);
  }

  /**
   * Per-student sync pass. Only students whose own interval has passed are synced:
   * active (seen in the last 24 h) every hour, inactive once a day. At most `batchSize`
   * students per pass, so Moodle never gets a burst. One failing student is logged and skipped.
   */
  async syncDueStudents(batchSize = 10, now = new Date()): Promise<{ due: number; ok: number; failed: number }> {
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const candidates = await this.prismaService.user.findMany({
      where: { token: { not: null } },
      select: { id: true, lastSync: true, lastSeenAt: true },
    });
    const due = candidates
      .filter((user) => {
        const active = user.lastSeenAt !== null && user.lastSeenAt >= dayAgo;
        const interval = active ? hourAgo : dayAgo;
        return user.lastSync === null || user.lastSync <= interval;
      })
      .sort((a, b) => (a.lastSync?.getTime() ?? 0) - (b.lastSync?.getTime() ?? 0))
      .slice(0, batchSize);

    let ok = 0;
    let failed = 0;
    for (const user of due) {
      try {
        await this.syncStudentWithStoredToken(user.id);
        ok += 1;
      } catch (error) {
        failed += 1;
        this.logger.warn(`Sync failed for ${user.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return { due: due.length, ok, failed };
  }

  /** Id of the system group for users without a real group ("Без групи"), created on first use. */
  async ensureUngroupedGroupId(): Promise<number> {
    const group = await this.prismaService.group.upsert({
      where: { groupName: UNGROUPED_NAME },
      create: { groupName: UNGROUPED_NAME },
      update: {},
    });
    return group.id;
  }

  async syncData(username: string, password: string, userId: string) {
    let token: string;
    try {
      token = await this.moodleService.getToken(username, password);
    } catch (error) {
      if (error instanceof MoodleAuthError) {
        throw new UnauthorizedException('Невірний логін або пароль Moodle');
      }
      throw new ServiceUnavailableException('Moodle тимчасово недоступний');
    }
    await this.syncWithToken(token, userId);
  }

  private async syncWithToken(token: string, userId: string) {
    {
      const moodleUser = await this.moodleService.getUser(token);
      // An admin may have renamed or reassigned the group. Keep the stored assignment when the
      // user already has one; Moodle only fills the group for users who have none yet.
      const current = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { groupId: true },
      });
      // Groups are created by admins only. Moodle may name a group that is not in the system:
      // such users go to the system group "Без групи" instead of a new group being invented.
      let groupId = current?.groupId ?? null;
      if (!groupId) {
        const matched = moodleUser.group
          ? await this.prismaService.group.findUnique({ where: { groupName: moodleUser.group } })
          : null;
        groupId = matched?.id ?? (await this.ensureUngroupedGroupId());
      }
      const group = { id: groupId };
      await this.prismaService.user.upsert({
        where: {
          id: userId,
        },
        create: {
          id: userId,
          token: token,
          groupId: group.id,
          lastSync: new Date(),
        },
        update: {
          token: token,
          groupId: group.id,
          lastSync: new Date(),
        }
      })
      const courses = await this.moodleService.getStudentCourses(token);
      await Promise.all(courses.map(async (course) => {
        // Write only what actually changed: an unchanged Moodle answer leaves the rows alone.
        const teacher = course.teacherName ?? 'Невідомо';
        const existingDiscipline = await this.prismaService.discipline.findUnique({
          where: { moodleId: course.id },
        });
        const discipline = existingDiscipline
          ? existingDiscipline.disciplineName === course.name && existingDiscipline.teacher === teacher
            ? existingDiscipline
            : await this.prismaService.discipline.update({
                where: { moodleId: course.id },
                data: { disciplineName: course.name, teacher },
              })
          : await this.prismaService.discipline.create({
              data: { moodleId: course.id, disciplineName: course.name, teacher },
            });

        await this.prismaService.usersDiscipline.upsert({
          where: {
            userId_disciplineId: { userId, disciplineId: discipline.id },
          },
          create: { userId, disciplineId: discipline.id },
          update: {},
        });

        const assignments = await this.moodleService.getCourseAssignments(token, discipline.moodleId);

        await Promise.all(assignments.map(async (assignment) => {
          const isCompleted = await this.moodleService.isAssignmentCompleted(token, assignment.id);

          const existingTask = await this.prismaService.task.findUnique({ where: { moodleId: assignment.id } });
          const sameDeadline = (a: Date | null, b: Date | null) =>
            (a === null && b === null) || (a !== null && b !== null && a.getTime() === b.getTime());
          const task = existingTask
            ? existingTask.taskName === assignment.title &&
              existingTask.description === assignment.description &&
              existingTask.disciplineId === discipline.id &&
              existingTask.cmid === assignment.cmid &&
              sameDeadline(existingTask.deadline, assignment.dueDate ?? null)
              ? existingTask
              : await this.prismaService.task.update({
                  where: { moodleId: assignment.id },
                  data: {
                    taskName: assignment.title,
                    deadline: assignment.dueDate,
                    description: assignment.description,
                    disciplineId: discipline.id,
                    cmid: assignment.cmid,
                  },
                })
            : await this.prismaService.task.create({
                data: {
                  moodleId: assignment.id,
                  taskName: assignment.title,
                  deadline: assignment.dueDate,
                  description: assignment.description,
                  disciplineId: discipline.id,
                  addedAt: assignment.addedAt ?? new Date(),
                  cmid: assignment.cmid,
                },
              });

          const existingLink = await this.prismaService.usersTask.findUnique({
            where: { userId_taskId: { userId, taskId: task.id } },
          });
          if (!existingLink) {
            await this.prismaService.usersTask.create({
              data: { userId, taskId: task.id, isCompleted },
            });
          } else if (existingLink.isCompleted !== isCompleted) {
            await this.prismaService.usersTask.update({
              where: { userId_taskId: { userId, taskId: task.id } },
              data: { isCompleted },
            });
          }
        })); 
      }));
    }
  }
}
