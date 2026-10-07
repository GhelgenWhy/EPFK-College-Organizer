import { useState, useMemo } from "react";
import { EventHeader } from "../components/events/EventHeader";
import { EventList } from "../components/events/EventList";
import { organizerApi } from "../services/api/organizer";
import { useApiQuery } from "../services/api/useApiQuery";
import { ApiQueryStatus } from "../components/ApiQueryStatus";
import type {
  PeriodFilter,
  StatusFilter,
  SortOption,
} from "../features/events/types";

export const EventPage = () => {
  const query = useApiQuery(organizerApi.getEvents);
  const [period, setPeriod] = useState<PeriodFilter>("Усі дати");
  const [status, setStatus] = useState<StatusFilter>("Усі статуси");
  const [sort, setSort] = useState<SortOption>("Спочатку найближчі");

  const handleReset = () => {
    setPeriod("Усі дати");
    setStatus("Усі статуси");
    setSort("Спочатку найближчі");
  };

  const filteredAndSortedEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Фільтрація за періодом
    const periodFiltered = (query.data ?? []).filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (period === "Минулі") {
        return eventDate < today;
      }
      if (period === "Цей тиждень") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1),
        );
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }
      if (period === "Цей місяць") {
        return (
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      }
      return true; // "Усі дати"
    });

    // 2. Фільтрація за статусом
    const statusFiltered = periodFiltered.filter((event) => {
      if (status === "Усі статуси") return true;
      return event.status === status;
    });

    const sorted = [...statusFiltered].sort((a, b) => {
      if (sort === "За назвою") {
        return a.title.localeCompare(b.title);
      }
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (sort === "Спочатку найближчі") {
        return dateA - dateB;
      }
      if (sort === "Спочатку найдальші") {
        return dateB - dateA;
      }
      return 0;
    });

    return sorted;
  }, [query.data, period, status, sort]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <EventHeader
        period={period}
        setPeriod={setPeriod}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
        onReset={handleReset}
      />
      <ApiQueryStatus query={query} loadingText="Завантаження подій…" />
      {query.data && <EventList events={filteredAndSortedEvents} />}
    </div>
  );
};

export default EventPage;
