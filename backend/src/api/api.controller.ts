import { Controller, Get, Req, Param, Post, Body } from '@nestjs/common';
import { ApiService } from './api.service.js';
import type { Request } from 'express';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('calendar')
  getCalendar(@Req() request: Request) {
    const token = request.cookies['moodle_token'];
    return this.apiService.getCalendar();
  }

  @Get('events')
  getEvents(@Req() request: Request) {
    const token = request.cookies['moodle_token'];
    return this.apiService.getEvents();
  }

  @Get('courses')
  async getCourses(@Req() request: Request) {
    return await this.apiService.getCourses((request as any).authUser.userId);
  }

  @Get('assignments/:courseId')
  async getAssignments(@Req() request: Request, @Param('courseId') courseId: number) {
    const tasks = await this.apiService.getCourseAssignments((request as any).authUser.userId, courseId);
    console.log(tasks)
    return tasks;
  }

  @Get('home')
  async getHome(@Req() request: Request) {
    return await this.apiService.getHome((request as any).authUser.userId);
  }
  @Get('schedule')
  getSchedule(@Req() request: Request) {
    return this.apiService.getSchedule();
  }
  @Post('syncronise')
  async syncData(@Body() body: {username: string, password: string}, @Req() request: Request) {
    try {
      await this.apiService.syncData(body.username, body.password, (request as any).authUser.userId);
      return { message: "syncronized" }
    } catch {
      return { message: "account not found" }
    }
  }
}
