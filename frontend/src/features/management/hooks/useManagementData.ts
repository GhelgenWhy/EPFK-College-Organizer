import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/react';
import { manageApi } from '../../../services/api/management';
import type {
  AssignmentRow,
  DisciplineOption,
  EventRow,
  GroupInfo,
  GroupSchedule,
  StudentInfo,
} from '../../../services/api/management';
import type { ApiRequestOptions } from '../../../services/api/client';

/**
 * Loads one management resource with the Clerk token.
 * `load` must be a stable callback (wrap it in useCallback in the caller).
 */
function useResource<T>(load: (options: ApiRequestOptions) => Promise<T>) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ data: T | null; error: Error | null; attempt: number } | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const controller = new AbortController();
    load({ getToken, signal: controller.signal }).then(
      (data) => {
        if (!controller.signal.aborted) setState({ data, error: null, attempt });
      },
      (reason: unknown) => {
        if (!controller.signal.aborted) {
          setState({ data: null, error: reason instanceof Error ? reason : new Error('Request failed'), attempt });
        }
      },
    );
    return () => controller.abort();
  }, [getToken, isLoaded, isSignedIn, attempt, load]);

  const refresh = useCallback(() => setAttempt((value) => value + 1), []);
  const current = state?.attempt === attempt ? state : null;
  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    isLoading: !isLoaded || (Boolean(isSignedIn) && !current),
    refresh,
  };
}

interface ManagementDataOptions {
  role: 'starosta' | 'admin';
  ownGroupId: number | null;
}

export function useManagementData({ role, ownGroupId }: ManagementDataOptions) {
  const isAdmin = role === 'admin';
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(ownGroupId);

  const groupsLoad = useCallback(
    (options: ApiRequestOptions) =>
      isAdmin
        ? manageApi.getGroups(options)
        : manageApi.getOwnStudents(options).then((students): GroupInfo[] => {
            const seen = new Map<number, GroupInfo>();
            for (const student of students) {
              if (student.groupId && student.groupName && !seen.has(student.groupId)) {
                seen.set(student.groupId, {
                  id: student.groupId,
                  groupName: student.groupName,
                  studentCount: students.filter((item) => item.groupId === student.groupId).length,
                  scheduleId: null,
                });
              }
            }
            return [...seen.values()];
          }),
    [isAdmin],
  );
  const groups = useResource(groupsLoad);

  const scheduleLoad = useCallback(
    (options: ApiRequestOptions): Promise<GroupSchedule | null> =>
      selectedGroupId ? manageApi.getGroupSchedule(options, selectedGroupId) : Promise.resolve(null),
    [selectedGroupId],
  );
  const schedule = useResource(scheduleLoad);

  const tasksLoad = useCallback(
    (options: ApiRequestOptions): Promise<AssignmentRow[]> =>
      selectedGroupId ? manageApi.getGroupTasks(options, selectedGroupId) : Promise.resolve([]),
    [selectedGroupId],
  );
  const tasks = useResource(tasksLoad);

  const disciplines = useResource(manageApi.getDisciplines);

  const studentsLoad = useCallback(
    (options: ApiRequestOptions): Promise<StudentInfo[]> =>
      isAdmin
        ? manageApi.getStudents(options, selectedGroupId ?? undefined)
        : manageApi.getOwnStudents(options),
    [isAdmin, selectedGroupId],
  );
  const students = useResource(studentsLoad);

  const eventsLoad = useCallback(
    (options: ApiRequestOptions): Promise<EventRow[]> =>
      isAdmin ? manageApi.getEvents(options) : Promise.resolve([]),
    [isAdmin],
  );
  const events = useResource(eventsLoad);

  const { refresh: refreshSchedule } = schedule;
  const { refresh: refreshTasks } = tasks;
  const { refresh: refreshStudents } = students;
  const { refresh: refreshEvents } = events;
  const refreshAll = useCallback(() => {
    refreshSchedule();
    refreshTasks();
    refreshStudents();
    if (isAdmin) refreshEvents();
  }, [refreshSchedule, refreshTasks, refreshStudents, refreshEvents, isAdmin]);

  const effectiveGroupId = useMemo(
    () => selectedGroupId ?? (isAdmin ? null : ownGroupId),
    [selectedGroupId, isAdmin, ownGroupId],
  );

  return {
    isAdmin,
    groups: groups.data ?? [],
    groupsLoading: groups.isLoading,
    selectedGroupId: effectiveGroupId,
    setSelectedGroupId,
    schedule: schedule.data,
    scheduleError: schedule.error,
    scheduleLoading: schedule.isLoading,
    tasks: tasks.data ?? [],
    tasksLoading: tasks.isLoading,
    disciplines: (disciplines.data ?? []) as DisciplineOption[],
    students: students.data ?? [],
    studentsLoading: students.isLoading,
    events: events.data ?? [],
    refreshAll,
  };
}
