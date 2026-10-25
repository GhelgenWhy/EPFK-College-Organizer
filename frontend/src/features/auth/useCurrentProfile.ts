import { useApiQuery } from '../../services/api/useApiQuery';
import { manageApi } from '../../services/api/management';
import type { CurrentUserProfile } from '../../services/api/management';

/**
 * Loads `/manage/me`, which returns the server-side role and group.
 * The server role wins over Clerk metadata so the UI matches real permissions.
 */
export function useCurrentProfile(loadMe: typeof manageApi.getMe = manageApi.getMe) {
  const query = useApiQuery(loadMe);
  return {
    profile: (query.data ?? null) as CurrentUserProfile | null,
    isLoading: query.isLoading,
    error: query.error,
    retry: query.retry,
  };
}
