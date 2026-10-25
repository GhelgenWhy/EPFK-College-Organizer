import type { CalendarDay, CalendarEvent, CalendarFilterType } from '../types';
import { WEEKDAYS_SHORT } from '../utils/dateUtils';
import { DayCell } from './DayCell';

interface CalendarGridProps {
  days: CalendarDay[];
  events: CalendarEvent[];
  activeFilter: CalendarFilterType;
  onSelectDay: (day: CalendarDay) => void;
}

export function CalendarGrid({
  days,
  events,
  activeFilter,
  onSelectDay,
}: CalendarGridProps) {

  // Фільтрація подій
  const filteredEvents = events.filter((e) => {
    if (activeFilter === 'DEADLINES_ONLY') return e.type === 'DEADLINE';
    if (activeFilter === 'EVENTS_ONLY') return e.type === 'EVENT';
    return true;
  });

  return (
    <>
      {/* Дні тижня */}
      <div className="grid h-9 grid-cols-7 items-center rounded-[20px] bg-[var(--surface-muted)]">
        {WEEKDAYS_SHORT.map((wd) => (
          <div key={wd} className="text-center text-[13px] font-bold text-[var(--text-muted)]">
            {wd}
          </div>
        ))}
      </div>

      {/* Сітка календаря */}
      {/* Rows are at least tall enough for the day number plus two task pills, so a day
          never shows a clipped second task. The grid scrolls if the month needs more room. */}
      <div className="grid h-full min-h-0 flex-1 auto-rows-[minmax(118px,1fr)] grid-cols-7 gap-[6px] overflow-auto">
        {days.map((day) => {
          const dayEvents = filteredEvents.filter(
            (e) => e.date === day.dateString
          );

          return (
            <DayCell
              key={day.dateString}
              day={day}
              events={dayEvents}
              onClick={() => onSelectDay(day)}
            />
          );
        })}
      </div>
    </>
  );
}
