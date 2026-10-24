import type { CalendarFilterType } from "../../calendar/types";
import type { CollegeEvent } from "../types";
import { formatDate, parseLocalDate } from "../utils/date";

function EventRow({
  event,
  onClick,
}: {
  event: CollegeEvent;
  onClick: () => void;
}) {
  return (
    <li className="max-[760px]:first:border-t-0 max-[760px]:[&+li]:border-t max-[760px]:[&+li]:border-[var(--border)] max-[760px]:[&+li]:border-l-0 [&+li]:border-l [&+li]:border-[var(--border)]">
      <button
        className="flex min-h-[54px] w-full items-center cursor-pointer gap-[10px] border-0 bg-transparent px-3 py-1 text-left text-inherit max-[760px]:min-h-[60px] max-[760px]:gap-[10px] max-[760px]:px-3 max-[760px]:py-2"
        onClick={onClick}
        type="button"
      >
        <time
          className="inline-flex min-h-7 min-w-[69px] items-center justify-center whitespace-nowrap rounded-lg bg-[var(--accent-soft)] px-2 text-[11px] font-bold text-[var(--accent)] max-[760px]:min-h-[27px] max-[760px]:min-w-[68px] max-[760px]:text-[10px]"
          dateTime={event.date}
        >
          {formatDate(parseLocalDate(event.date), { day: "numeric" })}{" "}
          {event.monthLabel}
        </time>
        <span className="flex min-w-0 flex-col items-start">
          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-[1.4] font-bold text-primary max-[760px]:text-[11px]">
            {event.title}
          </span>
          <span className="mt-1 text-[10px] text-[var(--text-muted)] max-[760px]:mt-1 max-[760px]:text-[10px]">
            {event.details}
          </span>
        </span>
      </button>
    </li>
  );
}

export function EventsSection({
  events,
  date,
  onOpenCalendar,
}: {
  events: CollegeEvent[];
  date: Date;
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
}) {
  return (
    <section
      className="grid min-h-[62px] shrink-0 grid-cols-[minmax(217px,0.44fr)_2fr] items-stretch rounded-[19px] bg-surface py-1 pr-3 max-[760px]:grid-cols-1 max-[760px]:py-0 max-[760px]:pr-3 max-[760px]:pb-[10px]"
      aria-labelledby="events-heading"
    >
      <div className="relative flex min-h-0 flex-col justify-center border-r border-[var(--border)] py-[6px] pr-[19px] pl-6 before:absolute before:top-1/2 before:-translate-y-1/2 before:left-2.5 before:w-[4px] before:h-[85%] before:rounded-[5px] before:bg-[var(--accent)] before:content-[''] max-[760px]:min-h-[68px] max-[760px]:border-r-0 max-[760px]:border-b">
        <h2
          id="events-heading"
          className="text-lg font-bold text-primary max-[760px]:text-base"
        >
          Події коледжу
        </h2>
        <button
          className="mt-2 inline-flex shrink-0 items-center gap-[6px] cursor-pointer self-start border-0 bg-transparent py-1 text-xs font-bold text-[var(--accent)] hover:underline hover:underline-offset-[3px] max-[760px]:mt-[3px] max-[760px]:text-[10px]"
          onClick={() =>
            onOpenCalendar(
              events[0] ? parseLocalDate(events[0].date) : date,
              "EVENTS_ONLY",
            )
          }
          type="button"
        >
          Переглянути всі <span aria-hidden="true">→</span>
        </button>
      </div>
      <ul className="m-0 grid list-none grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] p-0 max-[760px]:grid-cols-1">
        {events.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            onClick={() =>
              onOpenCalendar(parseLocalDate(event.date), "EVENTS_ONLY")
            }
          />
        ))}
      </ul>
    </section>
  );
}
