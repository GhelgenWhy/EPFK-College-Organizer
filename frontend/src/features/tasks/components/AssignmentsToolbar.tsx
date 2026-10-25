import type { SortOrder, StatusFilter } from '../types';

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'ALL', label: 'Всі' },
  { id: 'COMPLETED', label: 'Виконані' },
  { id: 'ACTIVE', label: 'Актуальні' },
  { id: 'OVERDUE', label: 'Прострочені' },
];

export function AssignmentsStatusTabs({
  statusFilter,
  onStatusFilterChange,
}: {
  statusFilter: StatusFilter;
  onStatusFilterChange: (statusFilter: StatusFilter) => void;
}) {
  return (
    <div
      className="relative top-[5px] inline-flex min-h-[46px] w-fit max-w-full shrink-0 items-center gap-0.5 overflow-x-auto rounded-xl bg-surface p-1 [scrollbar-width:none] max-[760px]:top-0 max-[760px]:min-h-[43px]"
      aria-label="Стан завдань"
      role="group"
    >
      {STATUS_TABS.map((tab) => (
        <button
          aria-pressed={statusFilter === tab.id}
          className={`inline-flex min-h-[38px] flex-[0_0_auto] cursor-pointer items-center justify-center rounded-[10px] border-0 px-[8.5px] text-[13px] font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:min-h-[35px] max-[760px]:px-[9px] max-[760px]:text-[10px] max-[380px]:px-[7px] max-[380px]:text-[9px] ${statusFilter === tab.id ? 'bg-[var(--accent)] text-on-accent hover:bg-[var(--accent-hover)]' : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-primary'}`}
          key={tab.id}
          onClick={() => onStatusFilterChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AssignmentsFiltersPanel({
  disciplines,
  discipline,
  onDisciplineChange,
  sortOrder,
  onSortOrderChange,
  onResetFilters,
}: {
  disciplines: string[];
  discipline: string;
  onDisciplineChange: (discipline: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onResetFilters: () => void;
}) {
  return (
    <aside
      className="[grid-area:filters] flex min-h-[306px] min-w-0 flex-col items-start gap-4 rounded-[19px] bg-surface px-[22px] py-[21px] max-[1250px]:min-w-0 max-[760px]:order-1 max-[760px]:grid max-[760px]:min-h-0 max-[760px]:grid-cols-2 max-[760px]:items-end max-[760px]:gap-3 max-[760px]:p-[14px] max-[380px]:grid-cols-1"
      aria-labelledby="assignment-filters-title"
    >
      <h2
        id="assignment-filters-title"
        className="text-[19px] font-bold leading-[1.3] tracking-[-0.025em] text-primary max-[760px]:col-span-full max-[760px]:text-base max-[380px]:col-span-1"
      >
        Фільтри
      </h2>

      <label className="flex min-w-0 flex-col gap-[10px] text-[13px] font-semibold text-primary max-[760px]:gap-[6px] max-[760px]:text-[9px]">
        <span>Сортування за дедлайном</span>
        <select
          className="min-h-[46px] w-max max-w-full min-w-0 cursor-pointer appearance-auto rounded-[11px] border-0 bg-[var(--input-background)] py-0 pr-3 pl-3 font-normal text-[13px] text-primary focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:min-h-[39px] max-[760px]:w-full max-[760px]:pl-2 max-[760px]:text-[10px]"
          value={sortOrder}
          onChange={(event) =>
            onSortOrderChange(event.target.value as SortOrder)
          }
        >
          <option value="SOONEST">Спочатку найближчі</option>
          <option value="LATEST">Спочатку найпізніші</option>
          <option value="TITLE">За назвою</option>
        </select>
      </label>

      <label className="flex min-w-0 flex-col gap-[10px] text-[13px] font-semibold text-primary max-[760px]:gap-[6px] max-[760px]:text-[9px]">
        <span>Дисципліна</span>
        <select
          className="min-h-[46px] w-[137px] max-w-full min-w-0 cursor-pointer appearance-auto rounded-[11px] border-0 bg-[var(--input-background)] py-0 pr-3 pl-3 font-normal text-[13px] text-primary focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:min-h-[39px] max-[760px]:w-full max-[760px]:pl-2 max-[760px]:text-[10px]"
          value={discipline}
          onChange={(event) => onDisciplineChange(event.target.value)}
        >
          <option value="ALL">Усі дисципліни</option>
          {disciplines.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </label>

      <button
        style={{ cursor: 'pointer' }}
        className="relative z-10 ml-[10px] inline-flex w-fit min-h-[34px] items-center justify-center rounded-lg border-0 bg-transparent font-bold text-[13px] text-[var(--accent)] hover:underline hover:underline-offset-[3px] focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px] max-[760px]:col-span-full max-[760px]:min-h-[28px] max-[760px]:justify-self-start max-[760px]:ml-0 max-[760px]:text-[10px] max-[380px]:col-span-1"
        onClick={onResetFilters}
        type="button"
      >
        Скинути фільтри
      </button>
    </aside>
  );
}
