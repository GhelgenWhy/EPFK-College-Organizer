import { useState, useMemo } from 'react';
import type { WeekType, LessonItem } from '../features/schedule/types';
import { MOCK_LESSONS } from '../features/schedule/mockData';
import { WeekTypeToggle } from '../features/schedule/components/WeekTypeToggle';
import { TimetableGrid } from '../features/schedule/components/TimetableGrid';

// Визначення поточного типу тижня
const getCurrentWeekType = (): WeekType => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const currentWeekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

  return currentWeekNumber % 2 === 0 ? 'DENOMINATOR' : 'NUMERATOR';
};

export const SchedulePage = () => {
  // Стан поточного типу тижня
  const [currentWeekType, setCurrentWeekType] = useState<WeekType>(getCurrentWeekType);

  // Фільтрація занять за типом тижня
  const filteredLessons = useMemo(() => {
    return MOCK_LESSONS.filter(
      (lesson: LessonItem) =>
        lesson.weekType === currentWeekType ||
        lesson.weekType === 'BOTH' ||
        !lesson.weekType
    );
  }, [currentWeekType]);

  return (
    <main className="schedule-page">
      {/* Перемикач типу тижня */}
      <div className="week-toggle-wrapper">
        <WeekTypeToggle
          currentWeekType={currentWeekType}
          onChange={setCurrentWeekType}
        />
      </div>

      {/* Розклад занять */}
      <TimetableGrid lessons={filteredLessons} />
    </main>
  );
};

export default SchedulePage;