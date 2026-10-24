import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';

export interface HomeroomScope {
  /** The authenticated user with the resolved application role. */
  user: AuthenticatedUser;
  /** Group ids the user may manage; empty for admins (they manage every group). */
  groupIds: number[];
}

/**
 * Resolves which groups a starosta (or admin) is allowed to manage.
 * Admins have access to every group, so their restriction list stays empty.
 */
@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async getScope(user: AuthenticatedUser): Promise<HomeroomScope> {
    if (user.role === 'admin') return { user, groupIds: [] };

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { groupId: true },
    });
    if (!dbUser?.groupId) {
      throw new ForbiddenException(
        'Закріпіть користувача за групою, щоб керувати її розкладом',
      );
    }
    return { user, groupIds: [dbUser.groupId] };
  }

  /** Throws when a non-admin scope tries to touch another group's data. */
  assertGroupAccess(scope: HomeroomScope, groupId: number): void {
    if (scope.user.role === 'admin') return;
    if (!scope.groupIds.includes(groupId)) {
      throw new ForbiddenException('Доступ до іншої групи заборонено');
    }
  }

  async assertScheduleAccess(scope: HomeroomScope, scheduleId: number) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
      select: { id: true, groupId: true },
    });
    if (!schedule) throw new NotFoundException('Розклад не знайдено');
    this.assertGroupAccess(scope, schedule.groupId);
    return schedule;
  }

  async assertDisciplineAccess(scope: HomeroomScope, disciplineId: number) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id: disciplineId },
      select: { id: true, moodleId: true, users: { select: { userId: true } } },
    });
    if (!discipline) throw new NotFoundException('Дисципліну не знайдено');
    if (scope.user.role === 'admin') return discipline;

    const groupUsers = await this.prisma.user.findMany({
      where: { groupId: { in: scope.groupIds } },
      select: { id: true },
    });
    const memberIds = new Set(groupUsers.map((member) => member.id));
    const allowed = discipline.users.some((member) => memberIds.has(member.userId));
    if (!allowed) {
      throw new ForbiddenException('Дисципліна не належить вашій групі');
    }
    return discipline;
  }

  /** Group ids that a user belongs to, used to filter schedule reads. */
  async getMemberGroupIds(user: AuthenticatedUser): Promise<number[]> {
    if (user.role === 'admin') return [];
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { groupId: true },
    });
    return dbUser?.groupId ? [dbUser.groupId] : [];
  }
}
