export type JsonObject = Record<string, unknown>;
type Check = (value: unknown) => boolean;

export function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export const string: Check = (value) => typeof value === 'string';
export const id: Check = (value) => typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
export const number: Check = (value) => typeof value === 'number' && Number.isFinite(value);
export const boolean: Check = (value) => typeof value === 'boolean';
export const optional = (check: Check): Check => (value) => value === undefined || check(value);
export const nullable = (check: Check): Check => (value) => value === null || check(value);
export const oneOf = (...values: unknown[]): Check => (value) => values.includes(value);
export const array = (check: Check): Check => (value) => Array.isArray(value) && value.every(check);
export const object = (fields: Record<string, Check>): Check => (value) => (
  isObject(value) && Object.entries(fields).every(([key, check]) => check(value[key]))
);

export const dateString: Check = (value) => string(value) && Number.isFinite(Date.parse(value as string));
export const dateKey: Check = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export function validated<T>(value: unknown, check: Check, resource: string): T {
  if (!check(value)) throw new Error(`Invalid ${resource} response`);
  return value as T;
}
