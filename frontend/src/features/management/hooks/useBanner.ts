import { useState } from 'react';

/** Small helper that keeps a temporary status message for a few seconds. */
export function useBanner() {
  const [state, setState] = useState<{ message: string; tone: 'success' | 'error' } | null>(null);

  function show(message: string, tone: 'success' | 'error' = 'success') {
    setState({ message, tone });
    window.setTimeout(() => setState(null), 4000);
  }

  return { banner: state, show, clear: () => setState(null) };
}
