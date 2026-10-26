import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ApiService } from './api.service.js';

/**
 * Keeps Moodle data fresh without the student doing anything: every hour the stored Moodle
 * tokens are used to re-check disciplines, assignments and completion. Unchanged data is not
 * rewritten (see ApiService.syncWithToken). Disabled with MOODLE_AUTO_SYNC=false (e.g. tests).
 */
@Injectable()
export class StudentSyncScheduler {
  private readonly logger = new Logger(StudentSyncScheduler.name);
  private running = false;

  constructor(private readonly api: ApiService) {}

  @Interval(60 * 60 * 1000)
  async runHourlySync(): Promise<void> {
    if (process.env.MOODLE_AUTO_SYNC === 'false') return;
    // Never overlap two runs: a slow Moodle must not stack up parallel sync loops.
    if (this.running) return;
    this.running = true;
    try {
      const summary = await this.api.syncAllLinkedStudents();
      this.logger.log(`Hourly Moodle sync: ${summary.ok}/${summary.total} ok, ${summary.failed} failed`);
    } catch (error) {
      this.logger.error(`Hourly Moodle sync crashed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.running = false;
    }
  }
}
