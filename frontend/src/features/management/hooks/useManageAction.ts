import { useAuth } from '@clerk/react';
import { useCallback, useState } from 'react';
import type { ApiRequestOptions } from '../../../services/api/client';

/**
 * Wraps a management API call with the Clerk token and an abort signal,
 * and keeps a single error message for the page-level banner.
 */
export function useManageAction(onSuccess?: () => void) {
  const { getToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T,>(action: (options: ApiRequestOptions) => Promise<T>): Promise<T> => {
      setError(null);
      const controller = new AbortController();
      try {
        const result = await action({ getToken, signal: controller.signal });
        onSuccess?.();
        return result;
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Операція не вдалася');
        throw reason;
      }
    },
    [getToken, onSuccess],
  );

  return { run, error, clearError: () => setError(null) };
}
