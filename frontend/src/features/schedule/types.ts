export type LessonFormat = 'OFFLINE' | 'ONLINE' | 'HYBRID';

export type WeekType = 'NUMERATOR' | 'DENOMINATOR';

export interface LessonItem {
  id: string;
  disciplineName: string;
  teacherName: string;
  /** Required: how the lesson is held. */
  format: LessonFormat;
  /** Optional classroom (used for OFFLINE and HYBRID). */
  location?: string | null;
  /** Optional online meeting link (used for ONLINE and HYBRID). */
  meetingLink?: string | null;
  startsAt: string;
  endsAt: string;
}

export interface ScheduleDay {
  weekday: number;
  name: string;
  lessons: [LessonItem | null, LessonItem | null, LessonItem | null, LessonItem | null, LessonItem | null, LessonItem | null];
}

export interface ScheduleResponse {
  timeSlots: [string, string, string, string, string, string];
  numerator: ScheduleDay[];
  denominator: ScheduleDay[];
}
