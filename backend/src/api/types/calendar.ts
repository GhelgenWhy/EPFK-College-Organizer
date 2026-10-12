export type CalendarEventType = 'DEADLINE' | 'EVENT';

export interface CalendarEvent {
  id: string | number;
  title: string;
  date: string;
  type: CalendarEventType;
  discipline?: string;
  description?: string;
  linkUrl?: string;
  time?: string;
}

export interface CalendarDay {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export type CalendarFilterType = 'ALL' | 'DEADLINES_ONLY' | 'EVENTS_ONLY';