import { useSearchParams } from 'react-router';
import type { CalendarDay, CalendarFilterType } from '../features/calendar/types';
import { MOCK_CALENDAR_EVENTS } from '../mocks/calendar';
import {
  generateCalendarMatrix,
  formatDateKey,
} from '../features/calendar/utils/dateUtils';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { EventSidebar } from '../components/calendar/EventSidebar';

function parseDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return formatDateKey(date) === value ? date : undefined;
}

function parseMonth(value: string | null, fallback: Date) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return new Date(fallback.getFullYear(), fallback.getMonth(), 1);
  const [year, month] = value.split('-').map(Number);
  if (month < 1 || month > 12) return new Date(fallback.getFullYear(), fallback.getMonth(), 1);
  return new Date(year, month - 1, 1);
}

function parseFilter(value: string | null): CalendarFilterType {
  if (value === 'deadlines_only') return 'DEADLINES_ONLY';
  if (value === 'events_only') return 'EVENTS_ONLY';
  return 'ALL';
}

export function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = parseDate(searchParams.get('date')) ?? new Date();
  const viewDate = parseMonth(searchParams.get('month'), selectedDate);
  const activeFilter = parseFilter(searchParams.get('filter'));

  function updateCalendar(params: { date?: Date; month?: Date; filter?: CalendarFilterType }) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (params.date) next.set('date', formatDateKey(params.date));
      if (params.month) next.set('month', formatDateKey(params.month).slice(0, 7));
      if (params.filter) {
        if (params.filter === 'ALL') next.delete('filter');
        else next.set('filter', params.filter.toLowerCase());
      }
      return next;
    });
  }

  // Перехід до попереднього місяця
  const handlePrevMonth = () => {
    updateCalendar({ month: new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1) });
  };

  // Перехід до наступного місяця
  const handleNextMonth = () => {
    updateCalendar({ month: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1) });
  };

  // Вибір дня календаря
  const handleSelectDay = (day: CalendarDay) => {
    updateCalendar({ date: day.date, month: day.date });
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
    <main className="flex min-h-0 flex-1 flex-col gap-[13px] overflow-hidden px-[30px] pt-[29px] pb-5 max-[760px]:px-4 max-[760px]:pt-4" aria-labelledby="calendar-page-title">
      <header className="flex min-h-[38px] shrink-0 items-center">
        <h1 id="calendar-page-title" className="text-[clamp(30px,1.8vw,34px)] font-bold leading-[1.15] tracking-[-0.045em] text-primary">Календар</h1>
      </header>

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden max-[760px]:flex-col max-[760px]:gap-3">
        {/* Основна частина календаря */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col max-[760px]:overflow-y-auto">
          <CalendarHeader
            viewDate={viewDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            activeFilter={activeFilter}
            onToggleFilter={(filter) => updateCalendar({ filter })}
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
    </main>
  );
}
