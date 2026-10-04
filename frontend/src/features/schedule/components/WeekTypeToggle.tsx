import type { WeekType } from '../types';

interface WeekTypeToggleProps {
  currentWeekType: WeekType;
  onChange: (type: WeekType) => void;
}

export const WeekTypeToggle = ({ currentWeekType, onChange }: WeekTypeToggleProps) => {
  return (
    <div className="week-toggle">
      <button
        type="button"
        onClick={() => onChange('NUMERATOR')}
        className={`toggle-btn ${currentWeekType === 'NUMERATOR' ? 'active' : ''}`}
      >
        Чисельник
      </button>

      <button
        type="button"
        onClick={() => onChange('DENOMINATOR')}
        className={`toggle-btn ${currentWeekType === 'DENOMINATOR' ? 'active' : ''}`}
      >
        Знаменник
      </button>
    </div>
  );
};