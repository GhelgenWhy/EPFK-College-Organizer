import React from "react";
import type { CollegeEvent, EventStatus } from "../../features/events/types";

interface EventListProps {
  events: CollegeEvent[];
}

const getStatusStyles = (status: EventStatus) => {
  switch (status) {
    case "Заплановано":
      return {
        statusBg: "bg-[var(--info-soft)] text-[var(--info)]",
        border: "border-[var(--info-soft)]",
      };
    case "Перенесено":
      return {
        statusBg: "bg-[var(--warning-soft)] text-[var(--warning)]",
        border: "border-gray-200/80",
      };
    case "Завершено":
      return {
        statusBg: "bg-gray-100 text-gray-600",
        border: "border-gray-200/80",
      };
    default:
      return {
        statusBg: "bg-gray-100 text-gray-600",
        border: "border-gray-200/80",
      };
  }
};

export const EventList: React.FC<EventListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-16 text-gray-400 text-sm">
        За обраними критеріями подій не знайдено.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-[30px] pb-5 w-full max-[760px]:px-4 overflow-y-auto flex-1">
      {events.map((event) => {
        const styles = getStatusStyles(event.status);

        return (
          <div
            key={event.id}
            className={`flex flex-col justify-between h-[180px] max-h-[180px] bg-surface border ${styles.border} rounded-[16px] px-5 py-3.5 shadow-sm relative transition-all hover:shadow-md overflow-hidden shrink-0`}
          >
            {/* Заголовок і Статус */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-bold text-gray-900 truncate">
                {event.title}
              </h3>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium shrink-0 ${styles.statusBg}`}
              >
                {event.status}
              </span>
            </div>

            {/* Дата і місце: за замовчуванням (маленька висота) — в 1 рядок, на великій висоті — в 2 рядки */}
            <div className="flex flex-row items-center gap-6 [@media(min-height:800px)]:flex-col [@media(min-height:800px)]:items-start [@media(min-height:800px)]:gap-1 text-sm text-teal-700">
              <div className="flex items-center gap-2 shrink-0">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {event.date} · {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="var(--text-primary)"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate text-[var(--text-primary)]">
                  {event.location}
                </span>
              </div>
            </div>

            {/* Опис */}
            <p className="text-xs text-gray-600 truncate">
              {event.description}
            </p>

            {/* Нижня мета-інформація */}
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100 truncate">
              <span>Організатор: {event.organizer}</span>
              <span>·</span>
              <span>{event.site}</span>
              <span>·</span>
              <span>Додано {event.createdAt}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventList;
