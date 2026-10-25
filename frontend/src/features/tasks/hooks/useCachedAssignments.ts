import { useEffect, useState } from 'react';
import type { Assignment } from '../types';

const ASSIGNMENTS_CACHE_KEY = 'epfk-organizer:assignments-data-cache';

function readCachedAssignments(): Assignment[] | null {
  try {
    const item = localStorage.getItem(ASSIGNMENTS_CACHE_KEY);
    if (!item) return null;
    const parsed: unknown = JSON.parse(item);

    if (!Array.isArray(parsed)) {
      localStorage.removeItem(ASSIGNMENTS_CACHE_KEY);
      return null;
    }

    return parsed as Assignment[];
  } catch {
    localStorage.removeItem(ASSIGNMENTS_CACHE_KEY);
    return null;
  }
}

/**
 * Keeps the last successful assignments response in localStorage so the page
 * can render something while the network request is still in flight.
 *
 * The cached snapshot is read once, lazily, through the `useState`
 * initializer. The effect only synchronizes the external store (localStorage)
 * and never calls setState, so no cascading render happens on mount. The
 * value returned is the fresh response when present, otherwise the cached
 * snapshot; the cache is deliberately not updated in state so a failed or
 * in-flight refetch keeps showing the last persisted data.
 */
export function useCachedAssignments(remoteData: Assignment[] | null) {
  const [cachedData] = useState(readCachedAssignments);

  useEffect(() => {
    if (!remoteData) return;

    try {
      localStorage.setItem(ASSIGNMENTS_CACHE_KEY, JSON.stringify(remoteData));
    } catch (e) {
      console.error('Не вдалося зберегти кеш завдань:', e);
    }
  }, [remoteData]);

  return remoteData ?? cachedData;
}
