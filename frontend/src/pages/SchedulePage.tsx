import { useSearchParams } from 'react-router';
import type { WeekType } from '../features/schedule/types';
import { WeekTypeToggle } from '../features/schedule/components/WeekTypeToggle';
import { TimetableGrid } from '../features/schedule/components/TimetableGrid';
import { organizerApi } from '../services/api/organizer';
import { useApiQuery } from '../services/api/useApiQuery';
import { ApiQueryStatus } from '../features/api/components/ApiQueryStatus';
import { EmptyState, type EmptyReason } from '../features/mystic/EmptyState';
import { useCurrentProfile } from '../features/auth/useCurrentProfile';

export const SchedulePage = () => {
  const query = useApiQuery(organizerApi.getSchedule);
  const schedule = query.data;
  const profileState = useCurrentProfile();
  const profile = profileState.profile;
  const hasLessons = !!schedule && [...schedule.numerator, ...schedule.denominator].some((day) => day.lessons.some((lesson) => lesson !== null));
  const emptyReason: EmptyReason | null = !schedule || hasLessons ? null : !profile?.groupId ? 'no-group' : !profile.lastSync ? 'not-synced' : 'no-schedule';
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedWeek = searchParams.get('week');
  const currentWeekType: WeekType = requestedWeek === 'denominator' ? 'DENOMINATOR' : 'NUMERATOR';

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

      <ApiQueryStatus query={query} loadingText="Завантаження розкладу…" />
      {emptyReason && <EmptyState reason={emptyReason} height={150} />}
      {schedule && !emptyReason && (
        <TimetableGrid
          days={schedule[currentWeekType === 'NUMERATOR' ? 'numerator' : 'denominator']}
          timeSlots={schedule.timeSlots}
        />
      )}
    </main>
  );
};

export default SchedulePage;

