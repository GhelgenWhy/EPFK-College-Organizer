import type { Discipline } from "../types";
import { textOr } from "../../../lib/nullSafe";

export function DisciplineCard({ discipline }: { discipline: Discipline }) {
  return (
    <article className="flex min-h-[120px] flex-col items-start rounded-[18px] border border-border bg-surface p-4 shadow-sm">
      <h2 className="m-0 text-base font-bold leading-snug text-primary">
        {discipline.name}
      </h2>
      <p className="mb-3 mt-3 text-sm font-medium text-link">
        {textOr(discipline.teacherName, 'Викладача не вказано')}
      </p>
      {discipline.moodleUrl ? (
        <a
          className="inline-flex min-h-7 items-center justify-center rounded-[9px] bg-accent px-2.5 text-[10px] font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          href={discipline.moodleUrl}
          target="_blank"
          rel="noreferrer"
        >
          Перейти в Moodle
        </a>
      ) : (
        <span className="text-xs text-muted">Посилання ще не додано</span>
      )}
    </article>
  );
}
