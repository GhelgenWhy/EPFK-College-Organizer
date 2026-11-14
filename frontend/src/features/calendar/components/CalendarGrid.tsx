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

      {/* Сітка календаря.
          Desktop: фіксована висота батька, ряди ділять її порівну (1fr).
          Phone: колонка календаря стає скрольованою, тому flex-1/h-full більше не дає
          висоти — ряди з minmax(0,1fr) схлопувались у смужки без номерів днів.
          Тут даємо ряду мінімальну висоту, достатню для числа й позначок, і хай
          сітка росте за вмістом. */}
      <div className="grid min-h-0 flex-1 auto-rows-[minmax(0,1fr)] grid-cols-7 gap-[6px] max-[760px]:flex-none max-[760px]:auto-rows-[minmax(52px,1fr)]">
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
