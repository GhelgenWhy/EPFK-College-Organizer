import { ApiError } from '../services/api/client';

export function ApiQueryStatus({ query, loadingText = 'Завантаження даних…' }: {
  query: { isLoading: boolean; isSignedOut: boolean; error: Error | null; retry: () => void };
  loadingText?: string;
}) {
  if (query.isSignedOut) return <p role="alert">Увійдіть, щоб переглянути дані.</p>;
  if (query.isLoading) return <p role="status" className="p-4 text-secondary">{loadingText}</p>;
  if (!query.error) return null;
  const unauthorized = query.error instanceof ApiError && query.error.status === 401;
  return (
    <div role="alert" className="rounded-xl bg-surface p-4 text-primary">
      <p>{unauthorized ? 'Сесію не підтверджено. Увійдіть знову та повторіть спробу.' : 'Не вдалося завантажити дані. Спробуйте ще раз.'}</p>
      <button type="button" className="mt-2 text-link hover:underline" onClick={query.retry}>Спробувати ще раз</button>
    </div>
  );
}
