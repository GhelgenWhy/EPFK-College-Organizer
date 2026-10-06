import { Controller, Get } from '@nestjs/common';
import { ScheduleService } from './schedule.service.js';

@Controller('api/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getSchedule() {
    return this.scheduleService.getSchedule();
  }
}
