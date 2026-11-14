import { Module } from '@nestjs/common';
import { MoodleService } from './moodle.service.js';
import { MoodleController } from './moodle.controller.js';

@Module({
    providers: [MoodleService],
    controllers: [MoodleController],
    exports: [MoodleService],
})
export class MoodleModule {}