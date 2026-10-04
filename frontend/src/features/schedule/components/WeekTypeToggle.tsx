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
        onClick={() => onChange('NUMERATOR')}
        className={`h-full whitespace-nowrap rounded-sm border-0 bg-transparent px-7 py-[5px] text-base font-bold transition-colors ${currentWeekType === 'NUMERATOR' ? 'bg-bg-active' : ''}`}
      >
        Чисельник
      </button>

      <button
        type="button"
        onClick={() => onChange('DENOMINATOR')}
        className={`h-full whitespace-nowrap rounded-sm border-0 bg-transparent px-7 py-[5px] text-base font-bold transition-colors ${currentWeekType === 'DENOMINATOR' ? 'bg-bg-active' : ''}`}
      >
        Знаменник
      </button>
    </div>
  );
};
