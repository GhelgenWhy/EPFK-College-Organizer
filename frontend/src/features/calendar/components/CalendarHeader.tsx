import type { CalendarFilterType } from '../types';
import { formatMonthHeader } from '../utils/dateUtils';

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
    <div className="calendar-controls-card">

      {/* Навігація по місяцях */}
      <div className="calendar-month-nav">
        <button
          type="button"
          className="calendar-nav-btn"
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

        <h2 className="calendar-month-title">
          {formatMonthHeader(viewDate)}
        </h2>

        <button
          type="button"
          className="calendar-nav-btn"
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
      <div className="calendar-filters-row">
        <span className="calendar-filters-label">ПОКАЗАТИ</span>

        <button
          type="button"
          className={`calendar-filter-btn ${activeFilter === 'DEADLINES_ONLY' ? 'active' : ''}`}
          onClick={() =>
            onToggleFilter(
              activeFilter === 'DEADLINES_ONLY' ? 'ALL' : 'DEADLINES_ONLY'
            )
          }
        >
          <div className="calendar-filter-dot-wrapper deadline">
            <div className="calendar-filter-dot-inner deadline" />
          </div>
          <span>Дедлайни</span>
        </button>

        <button
          type="button"
          className={`calendar-filter-btn ${activeFilter === 'EVENTS_ONLY' ? 'active' : ''}`}
          onClick={() =>
            onToggleFilter(
              activeFilter === 'EVENTS_ONLY' ? 'ALL' : 'EVENTS_ONLY'
            )
          }
        >
          <div className="calendar-filter-dot-wrapper event">
            <div className="calendar-filter-dot-inner event" />
          </div>
          <span>Події</span>
        </button>
      </div>
    </div>
  );
}