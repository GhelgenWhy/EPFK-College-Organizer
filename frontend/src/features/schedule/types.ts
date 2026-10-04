export type LessonFormat = 'OFFLINE' | 'ONLINE' | 'HYBRID';

export type WeekType = 'NUMERATOR' | 'DENOMINATOR';

export interface LessonItem {
  id: string;
  disciplineName: string;
  teacherName: string;
  lessonNumber: number;
  room?: string | null;
  startsAt: string;
  endsAt: string;
  weekday: number;
  weekType?: WeekType | 'BOTH';
  format: LessonFormat;
  meetingUrl?: string | null;
}