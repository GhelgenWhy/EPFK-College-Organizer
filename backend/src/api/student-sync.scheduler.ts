import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ApiService } from './api.service.js';

@Injectable()
export class StudentSyncScheduler {
  private readonly logger = new Logger(StudentSyncScheduler.name);
  private running = false;

  constructor(private readonly api: ApiService) {}

  @Interval(Number(process.env.MOODLE_SYNC_TICK_MS ?? 5 * 60 * 1000))
  async runSyncTick(): Promise<void> {
    if (process.env.MOODLE_AUTO_SYNC === 'false') return;
    if (this.running) return;
    this.running = true;
    try {
      const summary = await this.api.syncDueStudents();
      if (summary.due > 0) {
        this.logger.log(`Moodle sync tick: ${summary.ok}/${summary.due} ok, ${summary.failed} failed`);
      }
    } catch (error) {
      this.logger.error(`Moodle sync tick crashed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.running = false;
    }
  }
}
