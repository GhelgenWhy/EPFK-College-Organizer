import type { CalendarFilterType } from "../features/calendar/types";
import { organizerApi } from "../services/api/organizer";
import { useApiQuery } from "../services/api/useApiQuery";
import { ApiQueryStatus } from "../features/api/components/ApiQueryStatus";
import { useCachedHomeData } from "../features/home/hooks/useCachedHomeData";
import { HomeContent } from "../features/home/components/HomeContent";

interface HomePageProps {
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
  onOpenSchedule: () => void;
}

export function HomePage(props: HomePageProps) {
  const query = useApiQuery(organizerApi.getHome);
  const { data: dataToRender } = useCachedHomeData(query.data);

  if (!dataToRender) {
    return (
      <main className="min-h-0 flex-1 overflow-auto p-6">
        <h1 className="mb-5 text-3xl font-bold text-primary">Головна</h1>
        <ApiQueryStatus query={query} />
      </main>
    );
  }

  return (
    <HomeContent
      key={query.userId ?? "cached"}
      {...props}
      data={dataToRender}
      storageKey={`epfk-organizer:${query.userId ?? "local"}:home-completed-tasks`}
    />
  );
}
