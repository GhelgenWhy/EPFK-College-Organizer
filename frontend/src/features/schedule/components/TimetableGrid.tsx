import type { ScheduleDay } from '../types';
import { LessonCard } from './LessonCard';

interface TimetableGridProps {
  timeSlots: readonly string[];
  days: ScheduleDay[];
}

export const TimetableGrid = ({ timeSlots, days }: TimetableGridProps) => (
  <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[clamp(60px,8vw,130px)_repeat(5,minmax(0,1fr))] gap-1">
    <div className="grid min-h-0 min-w-0 grid-rows-[clamp(28px,5vh,48px)_minmax(0,1fr)] gap-1">
      <div className="flex min-w-0 items-center justify-center rounded-md bg-white px-1 text-center text-[clamp(9px,1vw,16px)] font-bold text-black">Час</div>
      <div className="grid min-h-0 grid-rows-6 gap-1 p-1">
        {timeSlots.map((time) => (
          <div key={time} className="flex min-h-0 min-w-0 items-center justify-center rounded-md bg-white px-1 text-center text-[clamp(9px,1vw,16px)] font-bold leading-tight text-black">{time}</div>
        ))}
      </div>
    </div>

    {days.map((day) => (
      <div key={day.weekday} className="grid min-h-0 min-w-0 grid-rows-[clamp(28px,5vh,48px)_minmax(0,1fr)] gap-1">
        <div className="flex min-w-0 items-center justify-center rounded-md bg-white px-1 text-center text-[clamp(9px,1vw,16px)] font-bold leading-tight text-black">{day.name}</div>
        <div className="grid min-h-0 grid-rows-6 gap-1 rounded-md bg-white p-1">
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
