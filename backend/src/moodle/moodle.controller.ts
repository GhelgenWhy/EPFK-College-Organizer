import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { MoodleService } from './moodle.service.js';

@Controller('moodle')
export class MoodleController {
  constructor(
    private readonly moodleService: MoodleService,
    private readonly prisma: PrismaService,
  ) {}

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
