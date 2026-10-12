import { Controller, Get, Req, Param } from '@nestjs/common';
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

  @Get('home')
  getHome(@Req() request: Request) {
    const token = request.cookies['moodle_token'];
    return this.apiService.getHome();
  }
  @Get('schedule')
  getSchedule(@Req() request: Request) {
    const token = request.cookies['moodle_token'];
    return this.apiService.getSchedule();
  }
}
