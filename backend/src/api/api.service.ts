import { BadRequestException, Injectable } from '@nestjs/common';
import { MOCK_CALENDAR_EVENTS } from './mock/calendar.js';
import { MOCK_COLLEGE_EVENTS } from './mock/events.js';
import {
  HOME_DEMO_DATE,
  HOME_DEADLINES,
  HOME_EVENTS,
  HOME_LESSONS,
  HOME_TASKS,
} from './mock/home.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ScheduleResponse } from './types/schedule.ts';
import axios from 'axios';
import { MoodleService } from '../moodle/moodle.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

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
    return {
      HOME_DEMO_DATE: HOME_DEMO_DATE,
      HOME_DEADLINES: HOME_DEADLINES,
      HOME_EVENTS: HOME_EVENTS,
      HOME_LESSONS: HOME_LESSONS,
      HOME_TASKS: HOME_TASKS,
    };
  }
  getSchedule() {
    return this.schedule;
  }
  async syncData(username: string, password: string, userId: string) {
    const token = await this.moodleService.getToken(username, password);
    if (token != null) {
      const user = await this.prismaService.user.upsert({
        where: {
          id: userId,
        },
        create: {
          id: userId,
          token: token,
        },
        update: {
          token: token,
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
          }
        });

        await this.prismaService.usersDiscipline.upsert({
          where: {
            userId_disciplineId: { userId, disciplineId: discipline.id },
          },
          create: { userId, disciplineId: discipline.id },
          update: {}
        });

        const assignments = await this.moodleService.getCourseAssignments(token, discipline.moodleId);

        await Promise.all(assignments.map(async (assignment) => {
          const isCompleted = await this.moodleService.isAssignmentCompleted(token, assignment.id);

          console.log(assignment)

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

          console.log(task)

          await this.prismaService.usersTask.upsert({
            where: {
              userId_taskId: { userId, taskId: task.id }
            },
            create: { userId: userId, taskId: task.id, isCompleted: isCompleted },
            update: { isCompleted: isCompleted }
          });
        })); 
      }));

    } else {
      throw new BadRequestException('account not found');
    }
  }
}
