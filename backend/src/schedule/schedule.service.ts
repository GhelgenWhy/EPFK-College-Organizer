import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ScheduleResponse } from './schedule.types.js';

@Injectable()
export class ScheduleService {
  private readonly schedule = JSON.parse(
    readFileSync(fileURLToPath(new URL('./schedule.json', import.meta.url)), 'utf8'),
  ) as ScheduleResponse;

  getSchedule(): ScheduleResponse {
    return this.schedule;
  }
}
