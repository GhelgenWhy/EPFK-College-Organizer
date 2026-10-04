import { useEffect, useState } from 'react';
const COMPLETED_TASKS_KEY = 'epfk-organizer:home-completed-tasks';

function readCompletedTasks(tasks: { id: string }[], storageKey: string) {
  try {
    const savedValue: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(savedValue)) return [];

    const taskIds = new Set(tasks.map((task) => task.id));
    return savedValue.filter((id): id is string => typeof id === 'string' && taskIds.has(id));
  } catch {
    return [];
  }
}

export function useTaskCompletion(tasks: { id: string }[], storageKey = COMPLETED_TASKS_KEY) {
  const [completedTaskIds, setCompletedTaskIds] = useState(() => readCompletedTasks(tasks, storageKey));

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedTaskIds));
    } catch {
      // Tasks remain usable when browser storage is unavailable.
    }
  }, [completedTaskIds, storageKey]);

  function toggleTask(taskId: string) {
    setCompletedTaskIds((currentIds) => (
      currentIds.includes(taskId)
        ? currentIds.filter((id) => id !== taskId)
        : [...currentIds, taskId]
    ));
  }

  return { completedTaskIds, toggleTask };
}
