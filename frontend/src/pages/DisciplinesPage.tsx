import { DisciplineGrid } from '../components/disciplines/DisciplineGrid';
import { moodleApi } from '../services/api/moodle';
import { useApiQuery } from '../services/api/useApiQuery';
import { ApiQueryStatus } from '../components/ApiQueryStatus';

export function DisciplinesPage() {
  const query = useApiQuery(moodleApi.getCourses);
  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-[30px] pb-8 pt-7 pr-[40px] max-[760px]:px-4 max-[760px]:pt-4" aria-labelledby="disciplines-heading">
      <h1 id="disciplines-heading" className="mb-5 text-3xl font-bold text-primary">Дисципліни</h1>
      <ApiQueryStatus query={query} loadingText="Завантаження дисциплін з Moodle…" />
      {query.data && (query.data.length > 0
        ? <DisciplineGrid disciplines={query.data} />
        : <p className="text-secondary">У Moodle поки немає доступних дисциплін.</p>)}
    </main>
  );
}
