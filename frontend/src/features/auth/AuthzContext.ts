import { createContext, useContext } from 'react';
import type { AppRole } from './roles';

export interface AuthzContextValue {
  role: AppRole;
  groupId: number | null;
  groupName: string | null;
}

export const AuthzContext = createContext<AuthzContextValue | null>(null);

export function useAuthz(): AuthzContextValue {
  const value = useContext(AuthzContext);
  if (!value) throw new Error('useAuthz must be used inside AuthzProvider');
  return value;
}
