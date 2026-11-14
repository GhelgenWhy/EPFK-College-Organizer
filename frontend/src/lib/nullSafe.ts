
export const EMPTY_TEXT = "-";

export function textOr(value: unknown, fallback = EMPTY_TEXT): string {
    return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

export function isValidDate(value: unknown): value is string {
    return typeof value === "string" && value !== "" && !Number.isNaN(Date.parse(value));
}

export function formatKyivDateTime(
    value: string | null | undefined,
    options: Intl.DateTimeFormatOptions,
    fallback = "Без дедлайну",
): string {
    if (!isValidDate(value)) return fallback;
    return new Intl.DateTimeFormat("uk-UA", { timeZone: "Europe/Kyiv", ...options }).format(
        new Date(value),
    );
}
