import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { ScheduleResponse, WeekType } from '../features/schedule/types';
import { WeekTypeToggle } from '../features/schedule/components/WeekTypeToggle';
import { TimetableGrid } from '../features/schedule/components/TimetableGrid';

function isScheduleResponse(value: unknown): value is ScheduleResponse {
  if (!value || typeof value !== 'object') return false;
  const schedule = value as Record<string, unknown>;
  if (!Array.isArray(schedule.timeSlots) || schedule.timeSlots.length !== 6) return false;

  return ['numerator', 'denominator'].every((week) => {
    const days = schedule[week];
    return Array.isArray(days) && days.every((day) => (
      day && typeof day === 'object'
      && Array.isArray(day.lessons)
      && day.lessons.length === 6
    ));
  });
}

export const SchedulePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [error, setError] = useState(false);
  const requestedWeek = searchParams.get('week');
  const currentWeekType: WeekType = requestedWeek === 'denominator' ? 'DENOMINATOR' : 'NUMERATOR';

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/schedule', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Schedule request failed');
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        if (!isScheduleResponse(data)) throw new Error('Invalid schedule response');
        setSchedule(data);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError(true);
      });

    return () => controller.abort();
  }, []);

  function changeWeek(week: WeekType) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('week', week.toLowerCase());
      return next;
    });
  }

  return (
    <main className="schedule-page" aria-labelledby="schedule-page-title">
      <header className="content-page-heading">
        <h1 id="schedule-page-title">Розклад</h1>
      </header>

      <div className="week-toggle-wrapper">
        <WeekTypeToggle currentWeekType={currentWeekType} onChange={changeWeek} />
      </div>

      {error && <p role="alert">Не вдалося завантажити коректний розклад. Спробуйте пізніше.</p>}
      {!schedule && !error && <p role="status">Завантаження розкладу…</p>}
      {schedule && (
        <TimetableGrid
          days={schedule[currentWeekType === 'NUMERATOR' ? 'numerator' : 'denominator']}
          timeSlots={schedule.timeSlots}
        />
      )}
    </main>
  );
};

export default SchedulePage;
