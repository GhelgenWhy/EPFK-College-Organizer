import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiService } from './api.service.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('calendar')
  getCalendar() {
    return this.apiService.getCalendar();
  }

  @Get('events')
  getEvents() {
    return this.apiService.getEvents();
  }

  @Get('courses')
  getCourses(@CurrentUser() user: AuthenticatedUser) {
    return this.apiService.getCourses(user.userId);
  }

  @Get('assignments/:courseId')
  getAssignments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.apiService.getCourseAssignments(user.userId, courseId);
  }

  @Get('home')
  getHome(@CurrentUser() user: AuthenticatedUser) {
    return this.apiService.getHome(user.userId);
  }

  @Get('schedule')
  getSchedule(@CurrentUser() user: AuthenticatedUser) {
    return this.apiService.getSchedule(user);
  }

  @Post('syncronise')
  syncData(
    @Body() body: { username: string; password: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.apiService.syncData(body.username, body.password, user.userId);
  }
}
