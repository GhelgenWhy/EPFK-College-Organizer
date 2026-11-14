import { ApiQueryStatus } from '../features/api/components/ApiQueryStatus';
import { AssignmentsContent } from '../features/tasks/components/AssignmentsContent';
import { useCachedAssignments } from '../features/tasks/hooks/useCachedAssignments';
import { moodleApi } from '../services/api/moodle';
import { useApiQuery } from '../services/api/useApiQuery';

export function AssignmentsPage() {
  const query = useApiQuery(moodleApi.getAssignments);
  const tasksToRender = useCachedAssignments(query.data);

  if (!tasksToRender)
    return (
      <main className="flex min-h-0 flex-1 flex-col p-6">
        <h1 className="mb-5 text-3xl font-bold text-primary">Завдання</h1>
        <ApiQueryStatus
          query={query}
          loadingText="Завантаження завдань з Moodle…"
        />
      </main>
    );

  return (
    <AssignmentsContent
      key={query.userId ?? 'cached'}
      tasks={tasksToRender}
      storageKey={`epfk-organizer:${query.userId ?? 'local'}:assignment-completed-tasks`}
    />
  );
}
