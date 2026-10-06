import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { createClerkClient } from "@clerk/backend";
import { IS_PUBLIC_KEY, ROLES_KEY, type AppRole } from "./auth.types.js";
import type { AuthenticatedUser } from "./auth.types.js";

interface AuthenticatedRequest extends Request {
  authUser?: AuthenticatedUser & { role?: string };
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  constructor(private readonly reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.authUser?.userId) {
      throw new ForbiddenException("User not authenticated");
    }

    if (!request.authUser.role) {
      try {
        const user = await this.clerk.users.getUser(request.authUser.userId);
        const publicMetadata = user.publicMetadata as { role?: string };
        request.authUser.role =
          publicMetadata?.role === "admin" ? "admin" : "user";
      } catch {
        request.authUser.role = "user";
      }
    }

    if (!roles || roles.length === 0) return true;

    if (
      roles.includes("admin" as AppRole) &&
      request.authUser.role !== "admin"
    ) {
      throw new ForbiddenException("Your role cannot access this resource");
    }

    return true;
  }
}
