import { useState } from 'react';
import type { CalendarDay, CalendarFilterType } from '../features/calendar/types';
import { MOCK_CALENDAR_EVENTS } from '../features/calendar/mockData';
import {
  generateCalendarMatrix,
  formatDateKey,
} from '../features/calendar/utils/dateUtils';
import { CalendarHeader } from '../features/calendar/components/CalendarHeader';
import { CalendarGrid } from '../features/calendar/components/CalendarGrid';
import { EventSidebar } from '../features/calendar/components/EventSidebar';

export function CalendarPage() {
  // Стан календаря
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [activeFilter, setActiveFilter] = useState<CalendarFilterType>('ALL');

  // Перехід до попереднього місяця
  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  // Перехід до наступного місяця
  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Вибір дня календаря
  const handleSelectDay = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };

  // Формування днів календаря
  const days = generateCalendarMatrix(viewDate, selectedDate);
  const selectedKey = formatDateKey(selectedDate);

  // Фільтрація подій для вибраної дати
  const sidebarEvents = MOCK_CALENDAR_EVENTS.filter((e) => {
    if (e.date !== selectedKey) return false;
    if (activeFilter === 'DEADLINES_ONLY') return e.type === 'DEADLINE';
    if (activeFilter === 'EVENTS_ONLY') return e.type === 'EVENT';
    return true;
  });

  return (
    <div className="calendar-page-layout">
      {/* Основна частина календаря */}
      <div className="calendar-main">
        <CalendarHeader
          viewDate={viewDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          activeFilter={activeFilter}
          onToggleFilter={setActiveFilter}
        />

        <CalendarGrid
          days={days}
          events={MOCK_CALENDAR_EVENTS}
          activeFilter={activeFilter}
          onSelectDay={handleSelectDay}
        />
      </div>

      {/* Бічна панель з подіями */}
      <EventSidebar selectedDate={selectedDate} events={sidebarEvents} />
    </div>
  );
}