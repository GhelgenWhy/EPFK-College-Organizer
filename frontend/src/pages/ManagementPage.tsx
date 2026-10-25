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
import { StudentsManager } from '../features/management/components/StudentsManager';
import { manageApi } from '../services/api/management';

export function ManagementPage() {
  const { role, groupId: ownGroupId, groupName } = useAuthz();
  const [tab, setTab] = useState<ManageTab>('schedule');

  // Both roles see students and schedules; only admins get group and event controls
  // (StudentsManager and EventManager hide them for starostas).
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
        <StudentsManager
          isAdmin={isAdmin}
          groups={data.groups}
          students={data.students}
          isLoading={data.studentsLoading}
          onChanged={data.refreshAll}
        />
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

export default ManagementPage;
