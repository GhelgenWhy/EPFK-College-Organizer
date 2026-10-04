import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { SchedulePage } from './pages/SchedulePage';
import { CalendarPage } from './pages/CalendarPage';

export type PageType = 'schedule' | 'calendar';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageType>('schedule');

  return (
    <AppLayout
      activeTab={activeTab}
      onSelectTab={(tab) => setActiveTab(tab as PageType)}
    >
      {activeTab === 'schedule' && <SchedulePage />}
      {activeTab === 'calendar' && <CalendarPage />}
    </AppLayout>
  );
}
