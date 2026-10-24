import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUser } from './auth.types.js';

/** Injects the authenticated user (`{ userId, role }`) set by `ClerkAuthGuard`. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { authUser?: AuthenticatedUser }>();
    return request.authUser as AuthenticatedUser;
  },
);
