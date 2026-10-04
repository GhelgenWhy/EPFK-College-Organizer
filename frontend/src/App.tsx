import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { SchedulePage } from './pages/SchedulePage';
import { CalendarPage } from './pages/CalendarPage';
import { HomePage } from './features/home/components/HomePage';
import { AssignmentsPage } from './features/tasks/components/AssignmentsPage';
import type { CalendarFilterType } from './features/calendar/types';

export type PageType = 'home' | 'assignments' | 'schedule' | 'calendar';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageType>('home');
  const [calendarDate, setCalendarDate] = useState<Date | undefined>();
  const [calendarFilter, setCalendarFilter] = useState<CalendarFilterType>('ALL');

  function openCalendar(date: Date, filter: CalendarFilterType = 'ALL') {
    setCalendarDate(date);
    setCalendarFilter(filter);
    setActiveTab('calendar');
  }

  function selectTab(tab: string) {
    if (tab === 'calendar') {
      setCalendarDate(undefined);
      setCalendarFilter('ALL');
    }

    if (tab === 'home' || tab === 'assignments' || tab === 'schedule' || tab === 'calendar') {
      setActiveTab(tab);
    }
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onSelectTab={selectTab}
    >
      {activeTab === 'home' && (
        <HomePage onOpenCalendar={openCalendar} onOpenSchedule={() => setActiveTab('schedule')} />
      )}
      {activeTab === 'assignments' && <AssignmentsPage />}
      {activeTab === 'schedule' && <SchedulePage />}
      {activeTab === 'calendar' && (
        <CalendarPage initialDate={calendarDate} initialFilter={calendarFilter} />
      )}
    </AppLayout>
  );
}
