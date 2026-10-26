import { useState } from 'react';
import { useApiQuery } from '../../services/api/useApiQuery';
import { manageApi } from '../../services/api/management';
import type { CurrentUserProfile } from '../../services/api/management';

/**
 * Loads `/manage/me`, which returns the server-side role and group.
 * The server role wins over Clerk metadata so the UI matches real permissions.
 */
export function useCurrentProfile(loadMe: typeof manageApi.getMe = manageApi.getMe) {
  const query = useApiQuery(loadMe);
  // While a refresh is in flight useApiQuery returns no data; keep the last known profile so
  // the UI does not flash empty values (for example the header's last sync time).
  const [lastProfile, setLastProfile] = useState<CurrentUserProfile | null>(null);
  const fresh = (query.data ?? null) as CurrentUserProfile | null;
  if (fresh && fresh !== lastProfile) setLastProfile(fresh);
  return {
    profile: fresh ?? lastProfile,
    isLoading: query.isLoading,
    error: query.error,
    retry: query.retry,
  };
}
