import type { CalendarDay, CalendarEvent } from '../types';

interface DayCellProps {
  day: CalendarDay;
  events: CalendarEvent[];
  onClick: () => void;
}

export function DayCell({ day, events, onClick }: DayCellProps) {
  // Відображення перших двох подій
  const visibleEvents = events.slice(0, 2);
  const remainingCount = events.length - visibleEvents.length;

  return (
    <div
      className={`calendar-day-cell ${!day.isCurrentMonth ? 'other-month' : ''} ${
        day.isSelected ? 'selected' : ''
      } ${day.isToday ? 'today' : ''}`}
      onClick={onClick}
    >
      {/* Номер дня */}
      <div className="calendar-day-num-box">{day.dayNumber}</div>

      {/* Список подій */}
      {visibleEvents.length > 0 && (
        <div className="calendar-day-events-list">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className={`calendar-event-pill ${
                event.type === 'DEADLINE' ? 'deadline' : 'event'
              }`}
              title={event.title}
            >
              <p className="calendar-event-pill-text">{event.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* Кількість інших подій */}
      {remainingCount > 0 && (
        <span className="calendar-more-label">ще +{remainingCount}</span>
      )}
    </div>
  );
}