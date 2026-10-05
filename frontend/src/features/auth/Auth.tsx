import { SignIn, SignUp, useAuth, useUser } from '@clerk/react';
import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import logo from '../../assets/logo.svg';
import { resolveAppRole, type AppRole } from './roles';

export function AuthPage({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) return <Navigate to="/" replace />;

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label={mode === 'sign-in' ? 'Вхід' : 'Реєстрація'}>
        {mode === 'sign-in' ? (
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/"
            appearance={authAppearance}
          />
        ) : (
          <SignUp
            routing="hash"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/"
            appearance={authAppearance}
          />
        )}
      </section>
    </main>
  );
}

const authAppearance = {
  layout: { logoImageUrl: logo },
  variables: {
    colorPrimary: '#059492',
    colorText: '#01253b',
    colorTextSecondary: '#5b5b5b',
    colorInputText: '#01253b',
    colorInputBackground: '#ffffff',
    colorInputBorder: '#dde9e8',
    borderRadius: '10px',
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    rootBox: 'auth-provider',
    cardBox: 'auth-provider-card-box',
    card: 'auth-provider-card',
    logoImage: 'auth-provider-logo',
    headerTitle: 'auth-provider-title',
    headerSubtitle: 'auth-provider-subtitle',
    formFieldLabel: 'auth-provider-label',
    formFieldInput: 'auth-provider-input',
    formButtonPrimary: 'auth-provider-submit',
    footerActionLink: 'auth-provider-link',
    identityPreviewEditButton: 'auth-provider-link',
    formFieldAction: 'auth-provider-link',
  },
};

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
  if (!isSignedIn) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/sign-in?redirect_url=${redirect}`} replace />;
  }

  const role = resolveAppRole(user.publicMetadata.role);
  if (role !== 'admin' && !roles.includes(role)) {
    return <main className="auth-denied" role="alert"><h1>Немає доступу</h1><p>Вашій ролі поки не дозволено переглядати цю сторінку.</p></main>;
  }

  return children;
}
