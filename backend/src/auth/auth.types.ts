export type AppRole = 'student' | 'starosta' | 'admin';

export const APP_ROLES: readonly AppRole[] = ['student', 'starosta', 'admin'];

export interface AuthenticatedUser {
  userId: string;
  role: AppRole;
}

/**
 * Maps the Clerk role value to an application role.
 * Clerk keeps the legacy names `user` and `supervisor`; the app exposes
 * `student` and `starosta` instead. Unknown values fall back to the safest role.
 */
export function resolveAppRole(value: unknown): AppRole {
  if (value === 'admin') return 'admin';
  if (value === 'starosta' || value === 'supervisor') return 'starosta';
  return 'student';
}

/** Roles that may manage schedules, tasks and events for their own group. */
export const MANAGER_ROLES: readonly AppRole[] = ['starosta', 'admin'];

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
