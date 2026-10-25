import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { MoodleService } from './moodle.service.js';

/**
 * Raw Moodle proxies kept for diagnostics. The organizer UI reads synchronized
 * data through `/api`, using the Moodle token stored for the signed-in user.
 */
@Controller('moodle')
export class MoodleController {
  constructor(
    private readonly moodleService: MoodleService,
    private readonly prisma: PrismaService,
  ) {}

  /** Returns the Moodle token stored during synchronization; null when missing. */
  private async tokenFor(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { token: true },
    });
    return user?.token ?? null;
  }

  @Get('assignments/:courseId')
  async getAssignments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    const token = await this.tokenFor(user.userId);
    if (!token) return [];
    return this.moodleService.getCourseAssignments(token, courseId);
  }

  @Get('courses')
  async getCourses(@CurrentUser() user: AuthenticatedUser) {
    const token = await this.tokenFor(user.userId);
    if (!token) return [];
    return this.moodleService.getStudentCourses(token);
  }
}
