import type { ScheduleDay } from '../../features/schedule/types';
import { LessonCard } from './LessonCard';
import { useKyivClock } from '../../features/tasks/hooks/useKyivClock';

interface TimetableGridProps {
  timeSlots: readonly string[];
  days: ScheduleDay[];
}

export const TimetableGrid = ({ timeSlots, days }: TimetableGridProps) => {
  const { date } = useKyivClock();
  const currentWeekday = new Date(`${date}T00:00:00Z`).getUTCDay() || 7;

  return (
  <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[clamp(60px,8vw,130px)_repeat(5,minmax(0,1fr))] gap-1">
    <div className="grid min-h-0 min-w-0 grid-rows-[clamp(28px,5vh,48px)_minmax(0,1fr)] gap-1">
      <div className="flex min-w-0 items-center justify-center rounded-md bg-surface px-1 text-center text-[clamp(9px,1vw,16px)] font-bold text-primary">Час</div>
      <div className="grid min-h-0 grid-rows-6 gap-1 p-1">
        {timeSlots.map((time) => (
          <div key={time} className="flex min-h-0 min-w-0 items-center justify-center rounded-md bg-surface px-1 text-center text-[clamp(9px,1vw,16px)] font-bold leading-tight text-primary">{time}</div>
        ))}
      </div>
    </div>

    {days.map((day) => (
      <div key={day.weekday} aria-current={day.weekday === currentWeekday ? 'date' : undefined} className="grid min-h-0 min-w-0 grid-rows-[clamp(28px,5vh,48px)_minmax(0,1fr)] gap-1">
        <div className={`flex min-w-0 items-center justify-center rounded-md px-1 text-center text-[clamp(9px,1vw,16px)] font-bold leading-tight ${day.weekday === currentWeekday ? 'bg-bg-active text-on-nav-active' : 'bg-surface text-primary'}`}>{day.name}</div>
        <div className={`grid min-h-0 grid-rows-6 gap-1 rounded-md p-1 bg-surface`}>
          {day.lessons.map((lesson, index) => (
            <div key={index} className="flex min-h-0 min-w-0 items-stretch">
              {lesson && <LessonCard lesson={lesson} />}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  );
};
