import type { ScheduleDay } from '../types';
import { LessonCard } from './LessonCard';

interface TimetableGridProps {
  timeSlots: readonly string[];
  days: ScheduleDay[];
}

export const TimetableGrid = ({ timeSlots, days }: TimetableGridProps) => (
  <div className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain rounded-[20px]">
    <div className="grid min-w-[1100px] grid-cols-[150px_repeat(5,minmax(0,1fr))] items-start gap-[5px] pb-2">
      <div className="sticky left-0 z-20 flex min-w-0 flex-col gap-[5px]">
        <div className="sticky top-0 z-30 flex h-[55px] shrink-0 items-center justify-center rounded-md bg-white text-center text-base font-bold text-black shadow-sm">Час</div>
        <div className="flex flex-col gap-[5px]">
          {timeSlots.map((time) => (
            <div key={time} className="flex h-[128px] items-center justify-center whitespace-nowrap rounded-md bg-white text-base font-bold text-black">{time}</div>
          ))}
        </div>
      </div>

      {days.map((day) => (
        <div key={day.weekday} className="flex min-w-0 flex-col gap-[5px]">
          <div className="sticky top-0 z-10 flex h-[55px] shrink-0 items-center justify-center rounded-md bg-white text-center text-base font-bold text-black shadow-sm">{day.name}</div>
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
  </div>
);
