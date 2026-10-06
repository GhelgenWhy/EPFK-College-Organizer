import { Injectable } from '@nestjs/common';
import { MOCK_CALENDAR_EVENTS } from './mock/calendar.js';
import { MOCK_COLLEGE_EVENTS } from './mock/events.js';
import { HOME_DEMO_DATE, HOME_DEADLINES, HOME_EVENTS, HOME_LESSONS, HOME_TASKS } from './mock/home.js';
import axios from 'axios';

@Injectable()
export class ApiService {
    constructor() {}

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
            HOME_TASKS: HOME_TASKS
        }
    }
}