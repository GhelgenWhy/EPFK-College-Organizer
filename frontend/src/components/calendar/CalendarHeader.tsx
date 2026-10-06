import type { CalendarFilterType } from '../../features/calendar/types';
import { formatMonthHeader } from '../../features/calendar/utils/dateUtils';

interface CalendarHeaderProps {
  viewDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  activeFilter: CalendarFilterType;
  onToggleFilter: (filter: CalendarFilterType) => void;
}

export function CalendarHeader({
  viewDate,
  onPrevMonth,
  onNextMonth,
  activeFilter,
  onToggleFilter,
}: CalendarHeaderProps) {
  return (
    <div className="flex h-[76px] shrink-0 flex-col justify-center gap-[6px] rounded-[20px] bg-surface px-6 py-2 max-[760px]:h-auto max-[760px]:gap-2 max-[760px]:py-3">

      {/* Навігація по місяцях */}
      <div className="flex items-center gap-[10px]">
        <button
          type="button"
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[10px] border border-[var(--text-muted)] bg-transparent p-0 text-[var(--text-secondary)] transition-colors hover:bg-slate-100"
          onClick={onPrevMonth}
          aria-label="Попередній місяць"
        >
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
            <path
              d="M5.80961 11.5412C5.55575 11.795 5.14417 11.795 4.89031 11.5412L0.57118 7.222C-0.190209 6.46061 -0.190404 5.22632 0.57066 4.46465L4.8416 0.190394C5.09545 -0.0634648 5.50704 -0.0634648 5.76089 0.190394C6.01474 0.444247 6.01474 0.855832 5.76089 1.10968L1.48884 5.38174C1.23493 5.63564 1.23493 6.04718 1.48884 6.30102L5.80961 10.6218C6.06346 10.8757 6.06346 11.2873 5.80961 11.5412Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <h2 className="m-0 text-xl font-bold text-primary">
          {formatMonthHeader(viewDate)}
        </h2>

        <button
          type="button"
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[10px] border border-[var(--text-muted)] bg-transparent p-0 text-[var(--text-secondary)] transition-colors hover:bg-slate-100"
          onClick={onNextMonth}
          aria-label="Наступний місяць"
        >
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
            <path
              d="M0.190389 11.5412C0.444249 11.795 0.855826 11.795 1.10969 11.5412L5.42882 7.222C6.19021 6.46061 6.1904 5.22632 5.42934 4.46465L1.1584 0.190394C0.904547 -0.0634648 0.492963 -0.0634648 0.23911 0.190394C-0.0147427 0.444247 -0.0147427 0.855832 0.23911 1.10968L4.51116 5.38174C4.76507 5.63564 4.76507 6.04718 4.51116 6.30102L0.190389 10.6218C-0.0634632 10.8757 -0.0634632 11.2873 0.190389 11.5412Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Фільтри календаря */}
      <div className="flex h-8 items-center gap-[10px] max-[420px]:gap-1">
        <span className="text-[13px] font-bold tracking-[0.02em] text-[var(--text-secondary)]">ПОКАЗАТИ</span>

        <button
          type="button"
          className={`inline-flex h-[30px] box-border cursor-pointer items-center gap-[5px] rounded-[15px] border border-[var(--text-secondary)] bg-[var(--surface-muted)] px-3 py-[6px] text-[13px] font-bold text-[var(--text-secondary)] transition-all max-[420px]:gap-1 max-[420px]:px-2 ${activeFilter === 'DEADLINES_ONLY' ? 'bg-gray-300 text-gray-800' : ''}`}
          onClick={() =>
            onToggleFilter(
              activeFilter === 'DEADLINES_ONLY' ? 'ALL' : 'DEADLINES_ONLY'
            )
          }
        >
          <div className="flex h-[15px] w-[15px] items-center justify-center rounded-[10px] bg-[var(--danger-soft)]">
            <div className="h-[10px] w-[10px] rounded-[10px] bg-[var(--deadline-bg)]" />
          </div>
          <span>Дедлайни</span>
        </button>

        <button
          type="button"
          className={`inline-flex h-[30px] box-border cursor-pointer items-center gap-[5px] rounded-[15px] border border-[var(--text-secondary)] bg-[var(--surface-muted)] px-3 py-[6px] text-[13px] font-bold text-[var(--text-secondary)] transition-all max-[420px]:gap-1 max-[420px]:px-2 ${activeFilter === 'EVENTS_ONLY' ? 'bg-gray-300 text-gray-800' : ''}`}
          onClick={() =>
            onToggleFilter(
              activeFilter === 'EVENTS_ONLY' ? 'ALL' : 'EVENTS_ONLY'
            )
          }
        >
          <div className="flex h-[15px] w-[15px] items-center justify-center rounded-[10px] bg-[var(--calendar-highlight)]">
            <div className="h-[10px] w-[10px] rounded-[10px] bg-[var(--calendar-highlight-strong)]" />
          </div>
          <span>Події</span>
        </button>
      </div>
    </div>
  );
}
