export type AppRole = 'user' | 'admin' | 'supervisor';

export function resolveAppRole(value: unknown): AppRole {
  if (value === 'admin' || value === 'supervisor') return value;
  return 'user';
}
