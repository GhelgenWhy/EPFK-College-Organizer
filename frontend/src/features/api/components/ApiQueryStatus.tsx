import { ApiError } from '../../../services/api/client';
import { CheshireCat } from '../../mystic/CheshireCat';

export function ApiQueryStatus({ query, loadingText = 'Завантаження даних…' }: {
  query: { isLoading: boolean; isSignedOut: boolean; error: Error | null; retry: () => void };
  loadingText?: string;
}) {
  if (query.isSignedOut) return <p role="alert">Увійдіть, щоб переглянути дані.</p>;
  if (query.isLoading) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 p-4 text-center text-secondary">
        <CheshireCat pose="yarn" height={120} />
        <p className="m-0">{loadingText}</p>
      </div>
    );
  }
  if (!query.error) return null;
  const unauthorized = query.error instanceof ApiError && query.error.status === 401;
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl bg-surface p-4 text-center text-primary">
      <CheshireCat pose="dissolve" height={120} />
      <p>{unauthorized ? 'Сесію не підтверджено. Увійдіть знову та повторіть спробу.' : 'Не вдалося завантажити дані. Спробуйте ще раз.'}</p>
      <button type="button" className="mt-2 text-link hover:underline" onClick={query.retry}>Спробувати ще раз</button>
    </div>
  );
}
