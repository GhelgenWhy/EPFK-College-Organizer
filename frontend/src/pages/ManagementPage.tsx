import { useState } from 'react';
import { useAuthz } from '../features/auth/AuthzContext';
import { ROLE_LABELS } from '../features/auth/roles';
import { EventManager } from '../features/management/components/EventManager';
import { GroupPicker, ManageHeader, type ManageTab } from '../features/management/components/ManageUi';
import { ScheduleEditor } from '../features/management/components/ScheduleEditor';
import { TaskManager } from '../features/management/components/TaskManager';
import { Banner } from '../features/management/components/ManageUi';
import { useManageAction } from '../features/management/hooks/useManageAction';
import { useManagementData } from '../features/management/hooks/useManagementData';
import { manageApi } from '../services/api/management';

export function ManagementPage() {
  const { role, groupId: ownGroupId, groupName } = useAuthz();
  const [tab, setTab] = useState<ManageTab>('schedule');

  const isAdmin = role === 'admin';
  const data = useManagementData({ role: isAdmin ? 'admin' : 'starosta', ownGroupId });
  const groupId = data.selectedGroupId ?? ownGroupId;

  const action = useManageAction(data.refreshAll);

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-auto px-[30px] pt-2 pr-[40px] pb-5 max-[760px]:px-4">
      <ManageHeader
        title={isAdmin ? 'Керування коледжем' : 'Моя група'}
        subtitle={isAdmin ? `Роль: ${ROLE_LABELS[role]}` : `${groupName ?? 'Група не закріплена'} · ${ROLE_LABELS[role]}`}
        tabs={isAdmin ? ['schedule', 'tasks', 'students', 'events'] : ['schedule', 'tasks', 'students']}
        activeTab={tab}
        onTabChange={setTab}
      >
        {isAdmin && (
          <GroupPicker groups={data.groups} value={data.selectedGroupId} onChange={data.setSelectedGroupId} />
        )}
      </ManageHeader>

      <Banner message={action.error} tone="error" />

      {tab !== 'events' && groupId === null && (
        <p className="rounded-xl bg-[var(--warning-soft)] px-4 py-2 text-sm text-[var(--warning)]" role="alert">
          Оберіть групу, щоб керувати розкладом і завданнями.
        </p>
      )}

      {tab === 'schedule' && (
        data.scheduleLoading ? (
          <p className="text-sm text-muted">Завантаження розкладу…</p>
        ) : data.scheduleError ? (
          <p className="text-sm text-[var(--danger)]" role="alert">{data.scheduleError.message}</p>
        ) : data.schedule && groupId !== null ? (
          <ScheduleEditor
            key={groupId}
            groupId={groupId}
            schedule={data.schedule}
            canEdit
            onSave={(lesson) => action.run((options) => manageApi.saveLesson(groupId, lesson, options))}
            onDelete={(weekType, weekday, slot) =>
              action.run((options) => manageApi.deleteLesson(groupId, weekType, weekday, slot, options))}
          />
        ) : null
      )}

      {tab === 'tasks' && groupId !== null && (
        <TaskManager
          key={groupId}
          groupId={groupId}
          tasks={data.tasks}
          disciplines={data.disciplines}
          canEdit
          onCreate={(payload) => action.run((options) => manageApi.createTask(payload, options))}
          onDelete={(taskId) => action.run((options) => manageApi.deleteTask(taskId, options))}
        />
      )}

      {tab === 'students' && (
        <StudentsTable groupId={groupId} students={data.students} isLoading={data.studentsLoading} />
      )}

      {tab === 'events' && isAdmin && (
        <EventManager
          events={data.events}
          canEdit
          onCreate={(payload) => action.run((options) => manageApi.createEvent(payload, options))}
          onUpdate={(eventId, payload) => action.run((options) => manageApi.updateEvent(eventId, payload, options))}
          onDelete={(eventId) => action.run((options) => manageApi.deleteEvent(eventId, options))}
        />
      )}
    </main>
  );
}

function StudentsTable({
  groupId,
  students,
  isLoading,
}: {
  groupId: number | null;
  students: ReturnType<typeof useManagementData>['students'];
  isLoading: boolean;
}) {
  if (groupId === null) return <p className="text-sm text-muted">Оберіть групу, щоб побачити студентів.</p>;
  if (isLoading) return <p className="text-sm text-muted">Завантаження студентів…</p>;
  return (
    <div className="overflow-auto rounded-[18px] border border-border bg-surface">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-secondary">
            <th className="border-b border-border p-3 font-semibold">Студент (ID Clerk)</th>
            <th className="border-b border-border p-3 font-semibold">Moodle</th>
            <th className="border-b border-border p-3 font-semibold">Дисциплін</th>
            <th className="border-b border-border p-3 font-semibold">Завдань</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && (
            <tr><td className="p-4 text-muted" colSpan={4}>У цій групі ще немає студентів</td></tr>
          )}
          {students.map((student) => (
            <tr key={student.id}>
              <td className="border-b border-border p-3 font-mono text-xs text-primary">{student.id}</td>
              <td className="border-b border-border p-3 text-secondary">{student.moodleLinked ? 'Прив’язано' : 'Не прив’язано'}</td>
              <td className="border-b border-border p-3 text-secondary">{student.disciplineCount ?? 0}</td>
              <td className="border-b border-border p-3 text-secondary">{student.taskCount ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagementPage;
