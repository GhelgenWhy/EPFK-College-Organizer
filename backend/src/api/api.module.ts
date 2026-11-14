import { Module } from '@nestjs/common';
import { ApiService } from './api.service.js';
import { ApiController } from './api.controller.js';
import { MoodleModule } from '../moodle/moodle.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { StudentSyncScheduler } from './student-sync.scheduler.js';

@Module({
    providers: [ApiService, StudentSyncScheduler],
    controllers: [ApiController],
    exports: [ApiService],
    imports: [MoodleModule, PrismaModule]
})
export class ApiModule {}