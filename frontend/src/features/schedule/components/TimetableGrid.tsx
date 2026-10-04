import type { ScheduleDay } from '../types';
import { LessonCard } from './LessonCard';

interface TimetableGridProps {
  timeSlots: readonly string[];
  days: ScheduleDay[];
}

export const TimetableGrid = ({ timeSlots, days }: TimetableGridProps) => (
  <div className="grid w-full grid-cols-[150px_repeat(5,minmax(0,1fr))] gap-[5px] overflow-x-auto">
    <div className="flex min-w-0 flex-col gap-[5px]">
      <div className="flex h-[55px] shrink-0 items-center justify-center rounded-md bg-white text-center text-base font-bold text-black">Час</div>
      <div className="flex flex-col gap-[5px]">
        {timeSlots.map((time, index) => (
          <div key={index} className="flex h-[128px] items-center justify-center whitespace-nowrap rounded-md bg-white text-base font-bold text-black">{time}</div>
        ))}
      </div>
    </div>

    {days.map((day) => (
      <div key={day.weekday} className="flex min-w-0 flex-col gap-[5px]">
        <div className="flex h-[55px] shrink-0 items-center justify-center rounded-md bg-white text-center text-base font-bold text-black">{day.name}</div>
        <div className="flex flex-col gap-[5px] rounded-md bg-white p-[6px]">
          {day.lessons.map((lesson, index) => (
            <div key={index} className="flex h-[126px] w-full items-stretch">
              {lesson && <LessonCard lesson={lesson} />}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
