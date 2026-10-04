import { Module } from '@nestjs/common';
import { MoodleService } from './moodle.service.js';

@Module({
    providers: [MoodleService],
    exports: [MoodleService],
})
export class MoodleModule {}