import type { WeekType } from '../types';

interface WeekTypeToggleProps {
  currentWeekType: WeekType;
  onChange: (type: WeekType) => void;
}

export const WeekTypeToggle = ({ currentWeekType, onChange }: WeekTypeToggleProps) => {
  return (
    <div className="flex h-[55px] w-fit items-center gap-[15px] rounded-md bg-white p-[5px]">
      <button
        type="button"
        aria-pressed={currentWeekType === 'NUMERATOR'}
        onClick={() => onChange('NUMERATOR')}
        className={`h-full whitespace-nowrap rounded-sm border-0 px-7 py-[5px] text-base font-bold text-primary transition-colors focus-visible:outline-2 focus-visible:outline-link focus-visible:outline-offset-2 ${currentWeekType === 'NUMERATOR' ? 'bg-bg-active' : 'bg-transparent hover:bg-bg-main'}`}
      >
        Чисельник
      </button>

      <button
        type="button"
        aria-pressed={currentWeekType === 'DENOMINATOR'}
        onClick={() => onChange('DENOMINATOR')}
        className={`h-full whitespace-nowrap rounded-sm border-0 px-7 py-[5px] text-base font-bold text-primary transition-colors focus-visible:outline-2 focus-visible:outline-link focus-visible:outline-offset-2 ${currentWeekType === 'DENOMINATOR' ? 'bg-bg-active' : 'bg-transparent hover:bg-bg-main'}`}
      >
        Знаменник
      </button>
    </div>
  );
};
