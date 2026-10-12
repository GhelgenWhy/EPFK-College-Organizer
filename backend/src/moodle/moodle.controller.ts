import { Controller, Get, Req, Param } from '@nestjs/common';
import { MoodleService } from './moodle.service.js';
import type { Request } from 'express';

@Controller('moodle')
export class MoodleController {
    constructor(
        private readonly moodleService: MoodleService
    ) {}

    @Get('assignments/:courseId')
    getAssignments(@Req() request: Request, @Param('courseId') courseId: number) {
        const token = request.cookies['moodle_token'];
        return this.moodleService.getCourseAssignments(token, courseId);
    }

    @Get('courses')
    getCourses(@Req() request: Request) {
        const token = request.cookies['moodle_token'];
        return this.moodleService.getStudentCourses(token);
    }
}