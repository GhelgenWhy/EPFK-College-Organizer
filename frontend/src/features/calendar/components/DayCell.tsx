import type { CalendarDay, CalendarEvent } from "../types";

interface DayCellProps {
    day: CalendarDay;
    events: CalendarEvent[];
    onClick: () => void;
}

export function DayCell({ day, events, onClick }: DayCellProps) {
    const visibleEvents = events.slice(0, 1);
    const remainingCount = events.length - visibleEvents.length;

    const hasDeadline = events.some((event) => event.type === "DEADLINE");
    const hasEvent = events.some((event) => event.type === "EVENT");

    return (
        <div
            className={`flex h-full min-h-0 cursor-pointer flex-col items-start gap-[2px] overflow-hidden rounded-[10px] border-2 p-[4px_6px] transition-transform duration-100 hover:-translate-y-px max-[760px]:items-center max-[760px]:justify-start max-[760px]:gap-[3px] max-[760px]:rounded-[8px] max-[760px]:p-[4px_2px] ${day.isSelected ? "border-bg-active bg-calendar-selected" : day.isCurrentMonth ? "border-transparent bg-surface" : "border-transparent bg-calendar-outside-month"}`}
            onClick={onClick}>
            <div
                className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] text-lg font-bold leading-none max-[760px]:h-[22px] max-[760px]:w-auto max-[760px]:min-w-[22px] max-[760px]:px-[3px] max-[760px]:text-[13px] ${day.isToday ? "bg-bg-active text-on-nav-active" : "text-primary"}`}>
                {day.dayNumber}
            </div>

            {visibleEvents.length > 0 && (
                <div className="flex min-h-0 w-full flex-1 flex-col gap-[2px] overflow-hidden max-[760px]:hidden">
                    {visibleEvents.map((event) => (
                        <div
                            key={event.id}
                            className={`flex h-[18px] w-full shrink-0 items-center overflow-hidden rounded-[4px] px-1 ${event.type === "DEADLINE" ? "bg-[var(--deadline-bg)]" : "bg-[var(--event-bg)]"}`}
                            title={event.title}>
                            <p
                                className={`m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-bold leading-[1.2] ${event.type === "DEADLINE" ? "text-deadline-text" : "text-event-text"}`}>
                                {event.title}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {(hasDeadline || hasEvent) && (
                <div
                    className="hidden items-center justify-center gap-[3px] max-[760px]:flex"
                    aria-hidden="true">
                    {hasDeadline && (
                        <span className="h-[6px] w-[6px] rounded-full bg-[var(--deadline-bg)]" />
                    )}
                    {hasEvent && (
                        <span className="h-[6px] w-[6px] rounded-full bg-[var(--event-bg)]" />
                    )}
                </div>
            )}

            {remainingCount > 0 && (
                <span className="mt-auto mb-0.5 text-[11px] font-bold leading-none text-muted max-[760px]:hidden">
                    +{remainingCount}
                </span>
            )}
        </div>
    );
}
