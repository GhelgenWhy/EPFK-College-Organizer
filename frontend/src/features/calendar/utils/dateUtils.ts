import type { CalendarDay } from '../types';

export const UKRAINIAN_MONTHS = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

export const UKRAINIAN_MONTHS_GENITIVE = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
];

export const UKRAINIAN_WEEKDAYS_FULL = [
  'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'
];

export const WEEKDAYS_SHORT = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];

// Формування дати у форматі РРРР-ММ-ДД
export const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Формування заголовка місяця
export const formatMonthHeader = (date: Date): string => {
  const monthName = UKRAINIAN_MONTHS[date.getMonth()];
  return `${monthName} ${date.getFullYear()} р.`;
};

// Формування заголовка вибраної дати
export const formatSelectedDateHeader = (date: Date): string => {
  const weekday = UKRAINIAN_WEEKDAYS_FULL[date.getDay()];
  const day = date.getDate();
  const monthGenitive = UKRAINIAN_MONTHS_GENITIVE[date.getMonth()];
  return `${weekday}, ${day} ${monthGenitive}`;
};

// Створення днів календаря
export const generateCalendarMatrix = (
  viewDate: Date,
  selectedDate: Date
): CalendarDay[] => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const today = new Date();
  const todayKey = formatDateKey(today);
  const selectedKey = formatDateKey(selectedDate);

  const days: CalendarDay[] = [];

  // Дні попереднього місяця
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthTotalDays - i);
    const key = formatDateKey(d);
    days.push({
      date: d,
      dateString: key,
      dayNumber: d.getDate(),
      isCurrentMonth: false,
      isToday: key === todayKey,
      isSelected: key === selectedKey,
    });
  }

  // Дні поточного місяця
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const d = new Date(year, month, i);
    const key = formatDateKey(d);
    days.push({
      date: d,
      dateString: key,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: key === todayKey,
      isSelected: key === selectedKey,
    });
  }

  // Дні наступного місяця
  const remainder = days.length % 7;
  const remainingDays = remainder === 0 ? 0 : 7 - remainder;

  for (let i = 1; i <= remainingDays; i++) {
    const d = new Date(year, month + 1, i);
    const key = formatDateKey(d);
    days.push({
      date: d,
      dateString: key,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: key === todayKey,
      isSelected: key === selectedKey,
    });
  }

  return days;
};
