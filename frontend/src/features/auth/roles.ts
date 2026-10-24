export type AppRole = 'student' | 'starosta' | 'admin';

export const ROLE_LABELS: Record<AppRole, string> = {
  student: 'Студент',
  starosta: 'Староста',
  admin: 'Адміністратор',
};

/** Anyone who may open the organizer pages. */
export const ORGANIZER_ROLES: readonly AppRole[] = ['student', 'starosta', 'admin'];
/** Roles that may edit schedules and tasks for their group. */
export const MANAGER_ROLES: readonly AppRole[] = ['starosta', 'admin'];

/**
 * Clerk stores the role in `publicMetadata.role` using the legacy names
 * `user` and `supervisor`; the app shows them as student and starosta.
 */
export function resolveAppRole(value: unknown): AppRole {
  if (value === 'admin') return 'admin';
  if (value === 'starosta' || value === 'supervisor') return 'starosta';
  return 'student';
}

export function isManager(role: AppRole | null | undefined): boolean {
  return role === 'starosta' || role === 'admin';
}
