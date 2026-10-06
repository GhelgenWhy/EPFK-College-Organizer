import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';
import { IS_PUBLIC_KEY, resolveAppRole, type AuthenticatedUser } from './auth.types.js';

interface AuthenticatedRequest extends Request {
  authUser?: AuthenticatedUser;
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

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
      const metadata = claims.public_metadata;
      const role = metadata && typeof metadata === 'object'
        ? (metadata as Record<string, unknown>).role
        : undefined;
      request.authUser = { userId: claims.sub, role: resolveAppRole(role) };
      return true;
    } catch {
      throw new UnauthorizedException('The Clerk session token is invalid or expired');
    }
  }
}
