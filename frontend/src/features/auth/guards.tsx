import { useUser, useAuth } from '@clerk/react';
import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { resolveAppRole, type AppRole } from './roles';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) return <div className="auth-loading" role="status">Завантаження облікового запису…</div>;
  if (!isSignedIn) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/sign-in?redirect_url=${redirect}`} replace />;
  }

  return children;
}

export function RequireRole({ roles, children }: { roles: AppRole[]; children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();

  if (!isLoaded) return <div className="auth-loading" role="status">Завантаження облікового запису…</div>;
  if (!isSignedIn || !user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/sign-in?redirect_url=${redirect}`} replace />;
  }

  const role = resolveAppRole(user.publicMetadata.role);
  if (role !== 'admin' && !roles.includes(role)) {
    return <main className="auth-denied" role="alert"><h1>Немає доступу</h1><p>Вашій ролі поки не дозволено переглядати цю сторінку.</p></main>;
  }

  return children;
}
