import { Module } from '@nestjs/common';
import { ApiService } from './api.service.js';
import { ApiController } from './api.controller.js';
import { MoodleModule } from '../moodle/moodle.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
    providers: [ApiService],
    controllers: [ApiController],
    exports: [ApiService],
    imports: [MoodleModule, PrismaModule]
})
export class ApiModule {}