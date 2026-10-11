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
        moodleUrl: 'https://moodle.org',
    }));
  }

  async getHome(userId: string) {
    console.log(userId);
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
      const user = this.prismaService.user.upsert({
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
      for (const course of courses) {
        const discipline = await this.prismaService.discipline.upsert({
            where: {
                moodleId: course.id,
            },
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
                userId_disciplineId: {
                    userId,
                    disciplineId: discipline.id,
                },
            },
            create: {
                userId,
                disciplineId: discipline.id,
            },
            update: {},
        });
    }
    } else {
      throw new BadRequestException('account not found')
    }
  }
}
