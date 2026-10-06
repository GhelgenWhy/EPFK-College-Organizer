import { Module } from '@nestjs/common';
import { MoodleModule } from './moodle/moodle.module.js';
import { ApiModule } from './api/api.module.js';

@Module({
  imports: [MoodleModule, ApiModule],
})
export class AppModule {}
