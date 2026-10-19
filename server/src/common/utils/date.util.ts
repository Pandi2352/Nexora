/** All timestamps are stored and returned in UTC ISO-8601. */
export function toIsoString(date: Date | string | number = new Date()): string {
  return new Date(date).toISOString();
}

export function addMinutes(date: Date | string | number, minutes: number): Date {
  return new Date(new Date(date).getTime() + minutes * 60_000);
}

export function addDays(date: Date | string | number, days: number): Date {
  return addMinutes(date, days * 24 * 60);
}

/** True when `expiresAt` is in the past (tokens, invitations, sessions). */
export function isExpired(expiresAt: Date | string | number, now: Date = new Date()): boolean {
  return new Date(expiresAt).getTime() <= now.getTime();
}

export const DateUtil = { toIsoString, addMinutes, addDays, isExpired };
