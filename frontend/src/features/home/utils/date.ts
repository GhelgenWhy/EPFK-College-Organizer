export function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    ...options,
  }).format(date);
}

export function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function titleCase(value: string) {
  return `${value.slice(0, 1).toLocaleUpperCase("uk-UA")}${value.slice(1)}`;
}

export function formatDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
  }).format(date);
}
