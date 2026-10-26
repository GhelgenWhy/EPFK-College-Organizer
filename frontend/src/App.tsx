import { useUser } from '@clerk/react';
import { useNavigate, useOutlet } from 'react-router';
import { AppLayout } from './features/layout/components/AppLayout';
import { HomePage } from './pages/HomePage';
import { formatDateKey } from './features/calendar/utils/dateUtils';
import type { CalendarFilterType } from './features/calendar/types';
import { useCurrentProfile } from './features/auth/useCurrentProfile';
import { formatLastSync } from './lib/dates';

export function RootLayout() {
  const outlet = useOutlet();
  const { user } = useUser();
  const profile = useCurrentProfile();
  // Header shows the real Clerk name and avatar instead of the placeholder.
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  return (
    <AppLayout
      userName={fullName || user?.primaryEmailAddress?.emailAddress || undefined}
      userAvatar={user?.imageUrl}
      // Real last successful sync time from the server; clicking refreshes the profile.
      lastSync={formatLastSync(profile.profile?.lastSync ?? null)}
      onSyncClick={() => void profile.retry()}
    >
      {outlet}
    </AppLayout>
  );
}

export function HomeRoute() {
  const navigate = useNavigate();

  function openCalendar(date: Date, filter: CalendarFilterType = 'ALL') {
    const month = formatDateKey(date).slice(0, 7);
    const query = new URLSearchParams({ date: formatDateKey(date), month });
    if (filter !== 'ALL') query.set('filter', filter.toLowerCase());
    navigate(`/calendar?${query.toString()}`);
  }

  return (
    <HomePage
      onOpenCalendar={openCalendar}
      onOpenSchedule={() => navigate('/schedule')}
    />
  );
}

export function NotFoundRoute() {
  return <main className="mx-auto max-w-3xl p-8"><h1 className="text-2xl font-semibold">Сторінку не знайдено</h1></main>;
}
