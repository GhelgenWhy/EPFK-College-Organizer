import { useNavigate, useOutlet } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './features/home/components/HomePage';
import { formatDateKey } from './features/calendar/utils/dateUtils';
import type { CalendarFilterType } from './features/calendar/types';

export function RootLayout() {
  const outlet = useOutlet();
  return <AppLayout>{outlet}</AppLayout>;
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
