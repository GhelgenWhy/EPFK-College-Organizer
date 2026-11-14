import type { CalendarEvent } from '../types';
import { formatSelectedDateHeader } from '../utils/dateUtils';
import { formatEuropeanDate } from '../../../lib/dates';
import { CheshireCat } from '../../mystic/CheshireCat';

interface EventSidebarProps {
  selectedDate: Date;
  events: CalendarEvent[];
}

export function EventSidebar({ selectedDate, events }: EventSidebarProps) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col gap-2 max-[760px]:w-full max-[760px]:gap-2">

      {/* Заголовок з вибраною датою */}
      <div className="box-border flex h-[110px] items-center rounded-[20px] bg-[var(--accent-soft)] px-5 max-[760px]:h-auto max-[760px]:rounded-[14px] max-[760px]:px-4 max-[760px]:py-3">
        <h3 className="m-0 text-[32px] font-bold text-[var(--text-primary)] max-[760px]:text-[17px] max-[760px]:leading-tight">
          {formatSelectedDateHeader(selectedDate)}
        </h3>
      </div>

      {/* Список подій */}
      <div className="box-border flex min-h-0 flex-1 flex-col gap-[9px] overflow-y-auto rounded-[20px] bg-surface px-3 py-[14px] [scrollbar-color:var(--scrollbar)_transparent] scrollbar-thin max-[760px]:max-h-[240px] max-[760px]:gap-2 max-[760px]:rounded-[14px] max-[760px]:px-2 max-[760px]:py-2">
        {events.length === 0 ? (
          // Порожній день: від кота залишилась лише усмішка, як у Чеширського
          <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-1 py-6 text-center">
            <CheshireCat pose="grin" height={170} />
            <p className="m-0 text-muted">На цей день подій немає</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`box-border flex flex-col rounded-[15px] p-[10px] max-[760px]:rounded-[10px] max-[760px]:p-[8px] ${event.type === 'DEADLINE' ? 'gap-[2px] bg-[var(--deadline-bg)]' : 'gap-[10px] bg-[var(--event-bg)] max-[760px]:gap-[4px]'}`}
            >
              <p className="m-0 text-sm font-bold text-primary max-[760px]:text-[13px]">{event.title}</p>

              {event.discipline && (
                <p className="m-0 text-sm text-primary max-[760px]:text-[12px]">{event.discipline}</p>
              )}

              {event.description && (
                <p className="m-0 whitespace-pre-line text-base text-primary max-[760px]:text-[12px]">{event.description}</p>
              )}

              {(event.date || event.time) && (
                <p className="m-0 text-xs font-bold text-primary max-[760px]:text-[11px]">
                  {formatEuropeanDate(event.date)}{event.time ? `, ${event.time}` : ''}
                </p>
              )}

              {/* Задание — ссылка на Moodle; событие — «Детальніше», только если задана ссылка */}
              {event.linkUrl && (
                <a
                  href={event.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block cursor-pointer text-xs font-bold text-primary underline"
                >
                  {event.type === 'DEADLINE' ? 'Відкрити в Moodle' : 'Детальніше'}
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
