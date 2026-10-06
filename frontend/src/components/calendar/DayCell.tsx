import type { CalendarDay, CalendarEvent } from '../../features/calendar/types';

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
      className={`flex h-full min-h-0 cursor-pointer flex-col items-start gap-[2px] overflow-hidden rounded-[10px] border-2 border-transparent p-[4px_6px] transition-transform duration-100 hover:-translate-y-px ${day.isSelected ? 'border-bg-active bg-[var(--surface)6dc]' : day.isCurrentMonth ? 'bg-surface' : 'bg-[var(--surface-muted)]'}`}
      onClick={onClick}
    >
      {/* Номер дня */}
      <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] text-lg font-bold leading-none text-primary ${day.isToday ? 'bg-bg-active' : ''}`}>{day.dayNumber}</div>

      {/* Список подій */}
      {visibleEvents.length > 0 && (
        <div className="flex min-h-0 w-full flex-1 flex-col gap-[2px] overflow-hidden">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className={`flex h-[18px] w-full shrink-0 items-center overflow-hidden rounded-[4px] px-1 ${event.type === 'DEADLINE' ? 'bg-[var(--deadline-bg)]' : 'bg-[var(--event-bg)]'}`}
              title={event.title}
            >
              <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-bold leading-[1.2] text-primary">{event.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* Кількість інших подій */}
      {remainingCount > 0 && (
        <span className="mt-auto mb-0.5 text-[11px] font-bold leading-none text-muted">ще +{remainingCount}</span>
      )}
    </div>
  );
}
