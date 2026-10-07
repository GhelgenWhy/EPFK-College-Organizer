export interface ScheduleLesson {
  id: string;
  disciplineName: string;
  teacherName: string;
  room?: string | null;
  startsAt: string;
  endsAt: string;
  format: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  meetingUrl?: string | null;
}

export interface ScheduleDay {
  weekday: number;
  name: string;
  lessons: [
    ScheduleLesson | null,
    ScheduleLesson | null,
    ScheduleLesson | null,
    ScheduleLesson | null,
    ScheduleLesson | null,
    ScheduleLesson | null,
  ];
}

export interface ScheduleResponse {
  timeSlots: [string, string, string, string, string, string];
  numerator: ScheduleDay[];
  denominator: ScheduleDay[];
}
