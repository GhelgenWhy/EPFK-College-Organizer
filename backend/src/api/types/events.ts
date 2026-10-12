export type EventStatus = "Заплановано" | "Перенесено" | "Завершено";

export interface CollegeEvent {
  id: string | number;
  title: string;
  date: string; // Формат 'YYYY-MM-DD'
  time: string; // Формат '14:00'
  status: EventStatus;
  location: string;
  description: string;
  organizer: string;
  site: string;
  createdAt: string;
}

export type PeriodFilter = "Усі дати" | "Цей тиждень" | "Цей місяць" | "Минулі";
export type StatusFilter =
  | "Усі статуси"
  | "Заплановано"
  | "Перенесено"
  | "Завершено";
export type SortOption =
  | "Спочатку найближчі"
  | "Спочатку найдальші"
  | "За назвою";