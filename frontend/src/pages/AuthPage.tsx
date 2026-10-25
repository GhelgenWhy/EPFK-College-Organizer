import { SignIn, SignUp, useAuth } from '@clerk/react';
import { Navigate } from 'react-router';
import logo from '../assets/logo.svg';

export function AuthPage({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) return <Navigate to="/" replace />;

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label={mode === 'sign-in' ? 'Вхід' : 'Реєстрація'}>
        {mode === 'sign-in' ? (
          <SignIn routing="hash" signUpUrl="/sign-up" fallbackRedirectUrl="/" appearance={authAppearance} />
        ) : (
          <SignUp routing="hash" signInUrl="/sign-in" fallbackRedirectUrl="/" appearance={authAppearance} />
        )}
      </section>
    </main>
  );
}

const authAppearance = {
  layout: { logoImageUrl: logo },
  variables: {
    colorPrimary: 'var(--accent)',
    colorText: 'var(--text-primary)',
    colorTextSecondary: 'var(--text-secondary)',
    colorInputText: 'var(--text-primary)',
    colorInputBackground: 'var(--surface)',
    colorInputBorder: 'var(--border)',
    // Clerk falls back to these when an element has no explicit background.
    // Mapping them to theme surfaces keeps form buttons from turning transparent.
    colorBackground: 'var(--surface)',
    colorNeutral: 'var(--text-primary)',
    borderRadius: '10px',
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    rootBox: 'auth-provider', cardBox: 'auth-provider-card-box', card: 'auth-provider-card',
    logoImage: 'auth-provider-logo', headerTitle: 'auth-provider-title',
    headerSubtitle: 'auth-provider-subtitle', formFieldLabel: 'auth-provider-label',
    formFieldInput: 'auth-provider-input', formButtonPrimary: 'auth-provider-submit',
    footerActionLink: 'auth-provider-link', identityPreviewEditButton: 'auth-provider-link',
    formFieldAction: 'auth-provider-link',
    socialButtonsBlockButton: 'auth-provider-social-button',
    socialButtonsBlockButtonText: 'auth-provider-social-text',
    alternativeMethodsBlockButton: 'auth-provider-alt-button',
    footerActionText: 'auth-provider-footer-text',
    internal: 'auth-provider-internal',
  },
};
