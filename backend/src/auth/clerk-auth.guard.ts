import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { Logger } from '@nestjs/common';
import type { Request } from 'express';
import { IS_PUBLIC_KEY, resolveAppRole, type AuthenticatedUser } from './auth.types.js';
import { PrismaService } from '../prisma/prisma.service.js';

interface AuthenticatedRequest extends Request {
  authUser?: AuthenticatedUser;
}

/** Activity is written at most this often per user, so a busy page does not write on every request. */
const LAST_SEEN_THROTTLE_MS = 10 * 60 * 1000;

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);
  private readonly lastSeenWritten = new Map<string, number>();

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  /** Records that the user was active; swallows errors so auth never fails because of it. */
  private touchLastSeen(userId: string) {
    const now = Date.now();
    const last = this.lastSeenWritten.get(userId) ?? 0;
    if (now - last < LAST_SEEN_THROTTLE_MS) return;
    this.lastSeenWritten.set(userId, now);
    this.prisma.user
      .updateMany({ where: { id: userId }, data: { lastSeenAt: new Date(now) } })
      .catch((error: unknown) => this.logger.warn(`lastSeenAt not stored: ${(error as Error).message}`));
  }

  /** Reads `publicMetadata.role` from the Clerk user when the session token has no role claim. */
  private async roleFromClerk(userId: string, secretKey: string) {
    try {
      const clerk = createClerkClient({ secretKey });
      const user = await clerk.users.getUser(userId);
      const role = (user.publicMetadata as { role?: unknown } | undefined)?.role;
      return resolveAppRole(role);
    } catch (error) {
      this.logger.warn(`Could not read role for ${userId}: ${(error as Error).message}`);
      return resolveAppRole(undefined);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new ServiceUnavailableException('Clerk authentication is not configured');
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) throw new UnauthorizedException('A Clerk bearer token is required');

    try {
      const claims = await verifyToken(token, { secretKey });
      // The session token can expose the metadata either flattened (`publicMetadata`)
      // or as the raw session claim `public_metadata`; accept both.
      const metadata = claims.publicMetadata ?? claims.public_metadata;
      const hasRoleClaim = metadata && typeof metadata === 'object' && 'role' in metadata;
      const role = hasRoleClaim ? (metadata as Record<string, unknown>).role : undefined;

      // Without the session claim the token says nothing about the role; ask Clerk
      // instead of silently downgrading an admin to a student.
      const resolvedRole = hasRoleClaim
        ? resolveAppRole(role)
        : await this.roleFromClerk(claims.sub, secretKey);

      request.authUser = { userId: claims.sub, role: resolvedRole };
      this.touchLastSeen(claims.sub);
      return true;
    } catch {
      throw new UnauthorizedException('The Clerk session token is invalid or expired');
    }
  }
}
