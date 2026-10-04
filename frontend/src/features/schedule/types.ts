export type LessonFormat = 'OFFLINE' | 'ONLINE' | 'HYBRID';

export type WeekType = 'NUMERATOR' | 'DENOMINATOR';

export interface LessonItem {
  id: string;
  disciplineName: string;
  teacherName: string;
  room?: string | null;
  startsAt: string;
  endsAt: string;
  format: LessonFormat;
  meetingUrl?: string | null;
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
