import type { CalendarEvent } from '../types';
import { formatSelectedDateHeader } from '../utils/dateUtils';

interface EventSidebarProps {
  selectedDate: Date;
  events: CalendarEvent[];
}

export function EventSidebar({ selectedDate, events }: EventSidebarProps) {
  return (
    <div className="calendar-sidebar">

      {/* Заголовок з вибраною датою */}
      <div className="calendar-sidebar-header-card">
        <h3 className="calendar-sidebar-header-title">
          {formatSelectedDateHeader(selectedDate)}
        </h3>
      </div>

      {/* Список подій */}
      <div className="calendar-sidebar-content-card">
        {events.length === 0 ? (
          // Повідомлення, якщо подій немає
          <p style={{ color: '#9A9A9A', margin: 0, padding: '10px 4px' }}>
            На цей день подій немає
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`calendar-detail-card ${
                event.type === 'DEADLINE' ? 'deadline' : 'event'
              }`}
            >
              <p className="calendar-detail-title">{event.title}</p>

              {event.discipline && (
                <p className="calendar-detail-sub">{event.discipline}</p>
              )}

              {event.description && (
                <p className="calendar-detail-desc">{event.description}</p>
              )}

              {event.time && (
                <p className="calendar-detail-meta">Дата: {event.time}</p>
              )}

              {event.linkUrl ? (
                <a
                  href={event.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="calendar-detail-link"
                >
                  {event.type === 'DEADLINE'
                    ? 'посилання на завдання'
                    : 'Детальніше'}
                </a>
              ) : (
                event.type === 'EVENT' && (
                  <span className="calendar-detail-link">Детальніше</span>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}