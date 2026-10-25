import type { CalendarFilterType } from "../../calendar/types";
import type { HomeDeadline } from "../types";
import { parseLocalDate } from "../utils/date";
import { formatEuropeanLabel } from "../../../lib/dates";
import { SectionHeading } from "./SectionHeading";

export function DeadlinesSection({
  deadlines,
  onOpenCalendar,
}: {
  deadlines: HomeDeadline[];
  onOpenCalendar: (date: Date, filter?: CalendarFilterType) => void;
}) {
  return (
    <section
      className="flex min-h-0 min-w-0 flex-col rounded-[19px] bg-surface p-3 max-[760px]:col-start-1 max-[760px]:min-h-0 max-[760px]:p-[17px_14px_12px]"
      aria-labelledby="deadlines-heading"
    >
      <SectionHeading
        id="deadlines-heading"
        title="Найближчі дедлайни"
        subtitle="Спочатку найтерміновіші"
      />
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-2 p-0 pt-2">
        {deadlines.map((deadline, index) => (
          <li className="min-h-0 flex-1" key={deadline.id}>
            <button
              className={`flex h-full min-h-0 w-full cursor-pointer flex-col items-start rounded-xl border px-3 py-2 text-left text-inherit transition-colors hover:border-[var(--accent-hover)] max-[760px]:min-h-[94px] max-[760px]:px-[11px] ${deadline.urgent ? "border-[var(--danger)] bg-[var(--danger-soft)]" : "border-[var(--border)] bg-surface"}`}
              type="button"
              onClick={() =>
                onOpenCalendar(parseLocalDate(deadline.date), "DEADLINES_ONLY")
              }
            >
              <span
                className={`inline-flex min-h-[25px] min-w-[140px] items-center rounded-lg px-[10px] text-[10px] font-bold max-[760px]:min-h-[27px] max-[760px]:text-[10px] ${index === 1 ? "bg-[var(--warning-soft)] text-[var(--warning)]" : deadline.urgent ? "bg-[var(--danger)] text-on-accent" : "bg-[var(--accent-soft)] text-[var(--accent)]"}`}
              >
                {formatEuropeanLabel(deadline.label)}
              </span>
              <span
                className="mt-1 line-clamp-1 text-xs leading-[1.25] font-bold text-primary max-[760px]:text-xs"
                title={deadline.title}
              >
                {deadline.title}
              </span>
              <span className="mt-1 text-[10px] text-[var(--text-muted)] max-[760px]:mt-1 max-[760px]:text-[10px]">
                {deadline.course}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
