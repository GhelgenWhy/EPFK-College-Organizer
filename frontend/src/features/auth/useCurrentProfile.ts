import { useState } from 'react';
import { useApiQuery } from '../../services/api/useApiQuery';
import { manageApi } from '../../services/api/management';
import type { CurrentUserProfile } from '../../services/api/management';

export function useCurrentProfile(loadMe: typeof manageApi.getMe = manageApi.getMe) {
  const query = useApiQuery(loadMe);
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
