import type { Discipline } from '../../features/disciplines/types';
import { DisciplineCard } from './DisciplineCard';

export function DisciplineGrid({ disciplines }: { disciplines: Discipline[] }) {
  if (disciplines.length === 0) {
    return <p className="rounded-xl bg-surface p-6 text-sm text-secondary">Дисциплін поки немає.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {disciplines.map((discipline) => <DisciplineCard key={discipline.id} discipline={discipline} />)}
    </div>
  );
}
