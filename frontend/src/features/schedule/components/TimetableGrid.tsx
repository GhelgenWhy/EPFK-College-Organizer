import { useMemo } from 'react';
import type { LessonItem } from '../types';
import { LessonCard } from './LessonCard';

interface TimetableGridProps {
  lessons: LessonItem[];
}

// Часові проміжки занять
const ALL_TIME_SLOTS = [
  { id: 1, time: '8:00 - 9:20' },
  { id: 2, time: '9:35 - 10:55' },
  { id: 3, time: '11:25 - 12:45' },
  { id: 4, time: '12:55 - 14:15' },
  { id: 5, time: '14:30 - 15:50' },
  { id: 6, time: '16:05 - 17:25' },
];

// Основні дні тижня
const BASE_WEEKDAYS = [
  { id: 1, name: 'Понеділок' },
  { id: 2, name: 'Вівторок' },
  { id: 3, name: 'Середа' },
  { id: 4, name: 'Четвер' },
  { id: 5, name: 'П’ятниця' },
];

// Субота додається, якщо є заняття
const SATURDAY = { id: 6, name: 'Субота' };

export const TimetableGrid = ({ lessons }: TimetableGridProps) => {

  // Перевірка наявності занять у суботу
  const hasSaturday = useMemo(() => {
    return lessons.some((lesson) => lesson.weekday === 6);
  }, [lessons]);

  // Формування списку днів
  const weekdays = useMemo(() => {
    return hasSaturday ? [...BASE_WEEKDAYS, SATURDAY] : BASE_WEEKDAYS;
  }, [hasSaturday]);

  // Визначення кількості пар
  const timeSlots = useMemo(() => {
    const hasSixthLesson = lessons.some((lesson) => lesson.lessonNumber === 6);
    return hasSixthLesson
      ? ALL_TIME_SLOTS
      : ALL_TIME_SLOTS.filter((slot) => slot.id !== 6);
  }, [lessons]);

  const currentDayIndex = new Date().getDay();

  return (
    <div className={`timetable-container ${hasSaturday ? 'has-saturday' : ''}`}>

      {/* Колонка з часом */}
      <div className="timetable-col">
        <div className="timetable-header-cell">Час</div>

        <div className="timetable-time-list">
          {timeSlots.map((slot) => (
            <div key={slot.id} className="timetable-time-cell">
              {slot.time}
            </div>
          ))}
        </div>
      </div>

      {/* Колонки днів тижня */}
      {weekdays.map((day) => {
        const isCurrentDay =
          day.id === (currentDayIndex === 0 ? 7 : currentDayIndex);

        return (
          <div key={day.id} className="timetable-col">

            {/* Назва дня */}
            <div
              className={`timetable-header-cell ${
                isCurrentDay ? 'current' : ''
              }`}
            >
              {day.name}
            </div>

            {/* Заняття за часом */}
            <div className="timetable-day-body">
              {timeSlots.map((slot) => {
                const lesson = lessons.find(
                  (l) =>
                    l.weekday === day.id &&
                    l.lessonNumber === slot.id
                );

                return (
                  <div key={slot.id} className="timetable-slot">
                    {lesson ? <LessonCard lesson={lesson} /> : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};