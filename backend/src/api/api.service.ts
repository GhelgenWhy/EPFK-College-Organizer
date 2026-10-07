import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ApiService {
  constructor() {}
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

  getHome() {
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
}
