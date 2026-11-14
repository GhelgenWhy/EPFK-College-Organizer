import { SignIn, SignUp, useAuth } from '@clerk/react';
import { Navigate } from 'react-router';
import logo from '../assets/logo.svg';

/** What the organizer does, shown next to the Clerk form to explain the product before sign-in. */
const FEATURES: { title: string; text: string }[] = [
  {
    title: 'Розклад і пари',
    text: 'Розклад на сьогодні та на тиждень, найближча пара з посиланням на Google Meet.',
  },
  {
    title: 'Дедлайни з Moodle',
    text: 'Завдання з Moodle підтягуються автоматично: що прострочено, що горить найближчі дні.',
  },
  {
    title: 'Події коледжу',
    text: 'Дні відкритих дверей, збори старост, конференції — все в одному календарі.',
  },
  {
    title: 'Своя група',
    text: 'Розклад і завдання добираються під вашу групу, яку ви обираєте в профілі.',
  },
];

/**
 * Public entry page. Left half explains what the organizer is for; right half is the Clerk
 * form. Both halves are reachable without an account.
 */
export function AuthPage({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) return <Navigate to="/" replace />;

  const isSignIn = mode === 'sign-in';

  return (
    <main className="auth-split">
      <section className="auth-intro" aria-labelledby="auth-intro-heading">
        <div className="auth-intro-head">
          <img src={logo} alt="EPFK College Organizer" className="auth-intro-logo" />
          <span className="auth-intro-badge">ЕПФК ЗНУ</span>
        </div>

        <div>
          <h1 id="auth-intro-heading" className="auth-intro-title">
            Особистий органайзер студента коледжу
          </h1>
          <p className="auth-intro-lead">
            Розклад, завдання з Moodle, дедлайни й події коледжу зібрані в одному місці.
            Заходьте з будь-якого пристрою — дані підтягуються з Moodle за вашим обліковим
            записом.
          </p>
        </div>

        <ul className="auth-intro-list">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <span className="auth-intro-dot" aria-hidden="true" />
              <div>
                <p className="auth-intro-item-title">{feature.title}</p>
                <p className="auth-intro-item-text">{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="auth-card" aria-label={isSignIn ? 'Вхід' : 'Реєстрація'}>
        {isSignIn ? (
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
