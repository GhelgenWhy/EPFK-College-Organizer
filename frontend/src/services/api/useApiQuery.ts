import { useAuth } from '@clerk/react';
import { useEffect, useState } from 'react';
import type { ApiRequestOptions } from './client';

type Loader<T> = (options: ApiRequestOptions) => Promise<T>;

export function useApiQuery<T>(load: Loader<T>) {
  const { getToken, isLoaded, isSignedIn, sessionId, userId } = useAuth();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    session: string; attempt: number; load: Loader<T>; data: T | null; error: Error | null;
  } | null>(null);
  const session = sessionId ?? userId ?? null;

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !session) return;
    const controller = new AbortController();
    void load({ getToken, signal: controller.signal }).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ session, attempt, load, data, error: null });
      },
      (reason: unknown) => {
        if (!controller.signal.aborted) {
          const error = reason instanceof Error ? reason : new Error('Request failed');
          setResult({ session, attempt, load, data: null, error });
        }
      },
    );
    return () => controller.abort();
  }, [attempt, getToken, isLoaded, isSignedIn, load, session]);

  const current = isLoaded && isSignedIn && result?.session === session && result.attempt === attempt && result.load === load
    ? result : null;
  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    isLoading: !isLoaded || (Boolean(isSignedIn) && !current),
    isSignedOut: isLoaded && !isSignedIn,
    userId,
    retry: () => setAttempt((value) => value + 1),
  };
}
