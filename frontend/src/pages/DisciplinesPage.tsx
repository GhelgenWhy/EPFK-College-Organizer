import { useState, useEffect } from "react";
import { DisciplineGrid } from "../features/disciplines/components/DisciplineGrid";
import { moodleApi } from "../services/api/moodle";
import { useApiQuery } from "../services/api/useApiQuery";
import { ApiQueryStatus } from "../features/api/components/ApiQueryStatus";
import type { Discipline } from "../features/disciplines/types";

const DISCIPLINES_CACHE_KEY = "epfk-organizer:disciplines-data-cache";

export function DisciplinesPage() {
  const query = useApiQuery(moodleApi.getCourses);

  const [cachedData] = useState<Discipline[] | null>(() => {
    try {
      const item = localStorage.getItem(DISCIPLINES_CACHE_KEY);
      if (!item) return null;
      const parsed = JSON.parse(item);

      if (!Array.isArray(parsed)) {
        localStorage.removeItem(DISCIPLINES_CACHE_KEY);
        return null;
      }

      return parsed;
    } catch {
      localStorage.removeItem(DISCIPLINES_CACHE_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (query.data) {
      // Persist only: the rendered list already uses query.data, so no state update here.
      try {
        localStorage.setItem(DISCIPLINES_CACHE_KEY, JSON.stringify(query.data));
      } catch (e) {
        console.error("Не вдалося зберегти кеш дисциплін:", e);
      }
    }
  }, [query.data]);

  const disciplinesToRender = query.data ?? cachedData;

  return (
    <main
      className="min-h-0 min-w-0 flex-1 overflow-y-auto px-[30px] pb-8 pt-7 pr-[40px] max-[760px]:px-4 max-[760px]:pt-4"
      aria-labelledby="disciplines-heading"
    >
      <h1
        id="disciplines-heading"
        className="mb-5 text-3xl font-bold text-primary"
      >
        Дисципліни
      </h1>

      {!disciplinesToRender ? (
        <ApiQueryStatus
          query={query}
          loadingText="Завантаження дисциплін з Moodle…"
        />
      ) : disciplinesToRender.length > 0 ? (
        <DisciplineGrid disciplines={disciplinesToRender} />
      ) : (
        <p className="text-secondary">
          У Moodle поки немає доступних дисциплін.
        </p>
      )}
    </main>
  );
}
