import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ScheduleModule } from './schedule/schedule.module.js';

@Module({
  imports: [HealthModule, ScheduleModule],
})
export class AppModule {}
