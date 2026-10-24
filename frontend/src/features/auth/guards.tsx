import { useAuth, useUser } from '@clerk/react';
import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { resolveAppRole, type AppRole } from './roles';
import { useCurrentProfile } from './useCurrentProfile';
import { AuthzContext } from './AuthzContext';

function LoadingScreen() {
  return <div className="auth-loading" role="status">Завантаження облікового запису…</div>;
}

function DeniedScreen() {
  return (
    <main className="auth-denied" role="alert">
      <h1>Немає доступу</h1>
      <p>Вашій ролі не дозволено переглядати цю сторінку.</p>
    </main>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/sign-in?redirect_url=${redirect}`} replace />;
  }

  return children;
}

/**
 * Gate for organizer pages. The role comes from the backend (`/manage/me`) so
 * it matches the permissions enforced by the API; Clerk metadata is used only
 * while that request is in flight.
 */
export function RequireRole({ roles, children }: { roles: readonly AppRole[]; children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { profile, isLoading, error, retry } = useCurrentProfile();
  const location = useLocation();

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn || !user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/sign-in?redirect_url=${redirect}`} replace />;
  }

  const fallbackRole = resolveAppRole(user.publicMetadata.role);

  if (isLoading && !profile) {
    // Show the page immediately for the metadata role, but never for role-mismatch.
    return roles.includes(fallbackRole) ? <>{children}</> : <LoadingScreen />;
  }

  if (error && !profile) {
    return (
      <main className="auth-denied" role="alert">
        <h1>Не вдалося завантажити профіль</h1>
        <p>{error.message}</p>
        <button type="button" onClick={retry}>Спробувати ще раз</button>
      </main>
    );
  }

  const role = profile?.role ?? fallbackRole;
  if (!roles.includes(role)) return <DeniedScreen />;

  return (
    <AuthzContext.Provider value={{ role, groupId: profile?.groupId ?? null, groupName: profile?.groupName ?? null }}>
      {children}
    </AuthzContext.Provider>
  );
}
