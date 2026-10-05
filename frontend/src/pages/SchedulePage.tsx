import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '@clerk/react';
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
  const { getToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [error, setError] = useState(false);
  const requestedWeek = searchParams.get('week');
  const currentWeekType: WeekType = requestedWeek === 'denominator' ? 'DENOMINATOR' : 'NUMERATOR';

  useEffect(() => {
    const controller = new AbortController();

    async function loadSchedule() {
      try {
        const token = await getToken();
        const response = await fetch('/api/schedule', {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) throw new Error('Schedule request failed');
        const data = await response.json() as unknown;
        if (!isScheduleResponse(data)) throw new Error('Invalid schedule response');
        setSchedule(data);
      } catch (reason) {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError(true);
      }
    }

    void loadSchedule();
    return () => controller.abort();
  }, [getToken]);

  function changeWeek(week: WeekType) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('week', week.toLowerCase());
      return next;
    });
  }

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-[13px] overflow-hidden px-[30px] pt-[29px] pr-[40px] pb-5 max-[760px]:px-4 max-[760px]:pt-4" aria-labelledby="schedule-page-title">
      <div className="flex h-[75px] shrink-0 items-center py-[10px]">
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
