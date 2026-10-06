export type AppRole = 'user' | 'admin' | 'supervisor';

export interface AuthenticatedUser {
  userId: string;
  role: AppRole;
}

export function resolveAppRole(value: unknown): AppRole {
  if (value === 'admin' || value === 'supervisor') return value;
  return 'user';
}

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
