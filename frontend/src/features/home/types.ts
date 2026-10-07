export type { HomeworkTask } from '../tasks/types';

export interface HomeLesson {
  id: string;
  startsAt: string;
  endsAt: string;
  title: string;
  teacher: string;
  location: string;
  meetingUrl?: string;
}

export interface CollegeEvent {
  id: string;
  date: string;
  monthLabel: string;
  title: string;
  details: string;
}

export interface HomeDeadline {
  id: string;
  date: string;
  label: string;
  title: string;
  course: string;
  urgent?: boolean;
}

export interface HomeData {
  date: Date;
  lessons: HomeLesson[];
  deadlines: HomeDeadline[];
  events: CollegeEvent[];
  tasks: import('../tasks/types').HomeworkTask[];
}
