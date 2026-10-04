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
      <div className="calendar-weekdays-bar">
        {WEEKDAYS_SHORT.map((wd) => (
          <div key={wd} className="calendar-weekday-item">
            {wd}
          </div>
        ))}
      </div>

      {/* Сітка календаря */}
      <div className="calendar-grid">
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