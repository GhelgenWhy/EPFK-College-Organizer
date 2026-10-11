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

  @Get('home')
  async getHome(@Req() request: Request) {
    return await this.apiService.getHome((request as any).authUser.userId);
  }
  @Get('schedule')
  getSchedule(@Req() request: Request) {
    return this.apiService.getSchedule();
  }
  @Post('syncronise')
  async syncData(@Body() body: {moodle_name: string, moodle_password: string}, @Req() request: Request) {
    try {
      await this.apiService.syncData(body.moodle_name, body.moodle_password, (request as any).authUser.userId);
      return { message: "syncronized" }
    } catch {
      return { message: "account not found" }
    }
  }
}
