import { Injectable } from '@nestjs/common';
import { MOCK_CALENDAR_EVENTS } from './mock/calendar.js';
import { MOCK_COLLEGE_EVENTS } from './mock/events.js';
import { HOME_EVENTS } from './mock/home.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ScheduleResponse } from './types/schedule.ts';
import type { HomeDeadline } from './types/home.ts';
import type { HomeworkTask } from './types/tasks.ts';
import { MoodleAuthError, MoodleService } from '../moodle/moodle.service.js';
import { ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

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

  getCalendar() {
    return MOCK_CALENDAR_EVENTS;
  }

  getEvents() {
    return MOCK_COLLEGE_EVENTS;
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
    let homeLessons: Lesson[] = [];

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
      const schedule = scheduleDB?.schedule as unknown as Schedule | null | undefined;
      const lessons = schedule?.[weekType]?.[mondayBasedIndex]?.lessons ?? [];

      homeLessons = lessons.filter((lesson): lesson is Lesson => lesson !== null);
    }
    // -------------------------------------------------- HOME_LESSONS

    return {
      HOME_DEMO_DATE: new Date(),
      HOME_DEADLINES: homeDeadlines,
      HOME_EVENTS: HOME_EVENTS,
      HOME_LESSONS: homeLessons,
      HOME_TASKS: homeTasks
    };
  }
  getSchedule(user: { userId: string; role: string }) {
    return this.findUserSchedule(user.userId, user.role === 'admin').then(
      (schedule) => schedule ?? this.schedule,
    );
  }

  /** Schedule stored for the user's group; admins fall back to the first group. */
  private async findUserSchedule(userId: string, isAdmin: boolean) {
    const stored = isAdmin
      ? await this.prismaService.schedule.findFirst()
      : await this.prismaService.schedule.findFirst({
          where: { group: { users: { some: { id: userId } } } },
        });
    const value = stored?.schedule as unknown as Schedule | undefined;
    if (!value?.numerator || !value?.denominator) return null;
    // Stored JSON may miss lessons entries added by newer clients; normalize slots.
    // The grid shows Monday to Friday only, so older Saturday entries are dropped.
    const normalizeDays = (days: Day[]) =>
      days
        .filter((day) => day.weekday >= 1 && day.weekday <= 5)
        .map((day) => ({
          ...day,
          lessons: Array.from({ length: 6 }, (_, slot) => day.lessons?.[slot] ?? null),
        }));
    return {
      timeSlots: value.timeSlots,
      numerator: normalizeDays(value.numerator),
      denominator: normalizeDays(value.denominator),
    };
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
    {
      const moodleUser = await this.moodleService.getUser(token);
      const group = await this.prismaService.group.upsert({
        where: {
          groupName: moodleUser.group
        },
        create: {
          groupName: moodleUser.group
        },
        update: {

        }
      })
      await this.prismaService.user.upsert({
        where: {
          id: userId,
        },
        create: {
          id: userId,
          token: token,
          groupId: group.id
        },
        update: {
          token: token,
          groupId: group.id
        }
      })
      const courses = await this.moodleService.getStudentCourses(token);
      await Promise.all(courses.map(async (course) => {
        const discipline = await this.prismaService.discipline.upsert({
          where: { moodleId: course.id },
          create: {
            moodleId: course.id,
            disciplineName: course.name,
            teacher: course.teacherName ?? 'Невідомо',
          },
          update: {
            disciplineName: course.name,
            teacher: course.teacherName ?? 'Невідомо',
          },
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

          const task = await this.prismaService.task.upsert({
            where: { moodleId: assignment.id },
            create: {
              moodleId: assignment.id,
              taskName: assignment.title,
              deadline: assignment.dueDate,
              description: assignment.description,
              disciplineId: discipline.id,
              addedAt: assignment.addedAt ?? new Date(),
              cmid: assignment.cmid
            },
            update: {
              taskName: assignment.title,
              deadline: assignment.dueDate,
              description: assignment.description,
              disciplineId: discipline.id,
              cmid: assignment.cmid
            }
          });

          await this.prismaService.usersTask.upsert({
            where: {
              userId_taskId: { userId, taskId: task.id }
            },
            create: { userId: userId, taskId: task.id, isCompleted: isCompleted },
            update: { isCompleted: isCompleted }
          });
        })); 
      }));
    }
  }
}
