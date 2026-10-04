import type { ScheduleDay } from '../types';
import { LessonCard } from './LessonCard';

interface TimetableGridProps {
  timeSlots: readonly string[];
  days: ScheduleDay[];
}

export const TimetableGrid = ({ timeSlots, days }: TimetableGridProps) => (
  <div className="timetable-container">
    <div className="timetable-col">
      <div className="timetable-header-cell">Час</div>
      <div className="timetable-time-list">
        {timeSlots.map((time, index) => (
          <div key={index} className="timetable-time-cell">{time}</div>
        ))}
      </div>
    </div>

    {days.map((day) => (
      <div key={day.weekday} className="timetable-col">
        <div className="timetable-header-cell">{day.name}</div>
        <div className="timetable-day-body">
          {day.lessons.map((lesson, index) => (
            <div key={index} className="timetable-slot">
              {lesson && <LessonCard lesson={lesson} />}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
