import { Module } from '@nestjs/common';
import { MoodleModule } from './moodle/moodle.module.js';
import { ApiModule } from './api/api.module.js';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from './schedule/schedule.module.js';
import { ClerkAuthGuard } from './auth/clerk-auth.guard.js';
import { RolesGuard } from './auth/roles.guard.js';


@Module({
  imports: [MoodleModule, ApiModule, ScheduleModule],
  providers: [
    { provide: APP_GUARD, useClass: ClerkAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
