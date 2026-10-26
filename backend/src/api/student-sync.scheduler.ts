import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ApiService } from './api.service.js';

/**
 * Keeps Moodle data fresh without a burst: every 5 minutes a small batch of students whose own
 * interval has passed is re-checked (active hourly, inactive daily; see ApiService.syncDueStudents).
 * Unchanged data is not rewritten. Disabled with MOODLE_AUTO_SYNC=false (e.g. tests).
 */
@Injectable()
export class StudentSyncScheduler {
  private readonly logger = new Logger(StudentSyncScheduler.name);
  private running = false;

  constructor(private readonly api: ApiService) {}

  @Interval(Number(process.env.MOODLE_SYNC_TICK_MS ?? 5 * 60 * 1000))
  async runSyncTick(): Promise<void> {
    if (process.env.MOODLE_AUTO_SYNC === 'false') return;
    // Never overlap two ticks: a slow Moodle must not stack up parallel sync loops.
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
