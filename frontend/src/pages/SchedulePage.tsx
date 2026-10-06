import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '@clerk/react';
import type { ScheduleResponse, WeekType } from '../features/schedule/types';
import { WeekTypeToggle } from '../components/schedule/WeekTypeToggle';
import { TimetableGrid } from '../components/schedule/TimetableGrid';
import { fetchWithClerkAuth } from '../services/api/client';

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
  const { getToken, isLoaded, isSignedIn, sessionId, userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadedSchedule, setLoadedSchedule] = useState<{ session: string; data: ScheduleResponse } | null>(null);
  const [errorSession, setErrorSession] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const authSession = sessionId ?? userId ?? (isSignedIn ? 'signed-in' : 'signed-out');
  const schedule = loadedSchedule?.session === authSession ? loadedSchedule.data : null;
  const hasError = errorSession === authSession && isSignedIn;
  const requestedWeek = searchParams.get('week');
  const currentWeekType: WeekType = requestedWeek === 'denominator' ? 'DENOMINATOR' : 'NUMERATOR';

  useEffect(() => {
    const controller = new AbortController();
    if (!isLoaded || !isSignedIn) return () => controller.abort();

    async function loadSchedule() {
      try {
        const response = await fetchWithClerkAuth(getToken, '/api/schedule', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Schedule request failed');
        const data = await response.json() as unknown;
        if (!isScheduleResponse(data)) throw new Error('Invalid schedule response');
        setLoadedSchedule({ session: authSession, data });
        setErrorSession(null);
      } catch (reason) {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setErrorSession(authSession);
      }
    }

    void loadSchedule();
    return () => controller.abort();
  }, [authSession, getToken, isLoaded, isSignedIn, retryCount]);

  function retrySchedule() {
    setErrorSession(null);
    setRetryCount((count) => count + 1);
  }

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

      {!isLoaded && <p role="status">Перевіряємо сесію…</p>}
      {isLoaded && !isSignedIn && <p role="alert">Увійдіть, щоб переглянути розклад.</p>}
      {hasError && <div role="alert"><p>Не вдалося завантажити коректний розклад.</p><button type="button" onClick={retrySchedule}>Спробувати ще раз</button></div>}
      {isLoaded && isSignedIn && !schedule && !hasError && <p role="status">Завантаження розкладу…</p>}
      {isLoaded && isSignedIn && schedule && (
        <TimetableGrid
          days={schedule[currentWeekType === 'NUMERATOR' ? 'numerator' : 'denominator']}
          timeSlots={schedule.timeSlots}
        />
      )}
    </main>
  );
};

export default SchedulePage;
