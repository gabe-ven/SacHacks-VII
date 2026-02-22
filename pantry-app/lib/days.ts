export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_PARAMS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export function wrapDay(day: number): number {
  return ((day % 7) + 7) % 7;
}

export function parseDayParam(param: string | null | undefined): number | null {
  if (!param) return null;
  const normalized = param.trim().toLowerCase();
  const idx = DAY_PARAMS.indexOf(normalized as (typeof DAY_PARAMS)[number]);
  return idx === -1 ? null : idx;
}

export function toDayParam(dayOfWeek: number): (typeof DAY_PARAMS)[number] {
  return DAY_PARAMS[wrapDay(dayOfWeek)];
}

export function getLocalDayOfWeek(): number {
  return new Date().getDay();
}
