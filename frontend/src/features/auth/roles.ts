export type AppRole = 'student' | 'starosta' | 'admin';

export const ROLE_LABELS: Record<AppRole, string> = {
  student: 'Студент',
  starosta: 'Староста',
  admin: 'Адміністратор',
};

export const ORGANIZER_ROLES: readonly AppRole[] = ['student', 'starosta', 'admin'];
export const MANAGER_ROLES: readonly AppRole[] = ['starosta', 'admin'];

export function resolveAppRole(value: unknown): AppRole {
  if (value === 'admin') return 'admin';
  if (value === 'starosta' || value === 'supervisor') return 'starosta';
  return 'student';
}

export function isManager(role: AppRole | null | undefined): boolean {
  return role === 'starosta' || role === 'admin';
}
