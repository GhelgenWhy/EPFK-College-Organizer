import { DisciplineGrid } from '../components/disciplines/DisciplineGrid';
import { MOCK_DISCIPLINES } from '../mocks/disciplines';

export function DisciplinesPage() {
  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-[30px] pb-8 pt-7 pr-[40px] max-[760px]:px-4 max-[760px]:pt-4" aria-labelledby="disciplines-heading">
      <h1 id="disciplines-heading" className="mb-5 text-3xl font-bold text-primary">Дисципліни</h1>
      <DisciplineGrid disciplines={MOCK_DISCIPLINES} />
    </main>
  );
}
