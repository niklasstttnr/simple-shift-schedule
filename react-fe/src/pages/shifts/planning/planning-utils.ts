import type { Shift } from "@/graphql/types";

/** Calendar grid config. Export so the page can use for layout and slot math. */
export const PLANNING_HOUR_START = 6;
export const PLANNING_HOUR_END = 24;
export const PLANNING_SLOT_MINUTES = 60;
export const PLANNING_ROW_HEIGHT = 40;
/** Height of the week calendar header row (time label column + day headers). Used to align the shift overlay. */
export const PLANNING_HEADER_HEIGHT = 52;

const MINUTES_PER_DAY = (PLANNING_HOUR_END - PLANNING_HOUR_START) * 60;
export const PLANNING_SLOTS_PER_DAY = MINUTES_PER_DAY / PLANNING_SLOT_MINUTES;

/** True if the shift overlaps the week that starts with weekStart (Monday 00:00). */
export function shiftInWeek(shift: Shift, weekStart: Date): boolean {
  const start = new Date(shift.startDateTime);
  const end = new Date(shift.endDateTime);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return start < weekEnd && end > weekStart;
}

/**
 * Day index 0–6 (Mon–Sun) for the shift’s start date in the given week.
 * Walks Mon–Sun to find which day contains the shift start.
 */
export function shiftDayIndex(shift: Shift, weekStart: Date): number {
  const start = new Date(shift.startDateTime);
  const dayStart = new Date(weekStart);
  dayStart.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const next = new Date(dayStart);
    next.setDate(next.getDate() + 1);
    if (start >= dayStart && start < next) return i;
    dayStart.setDate(dayStart.getDate() + 1);
  }
  return 0;
}

/** Percentage top and height (0–100) for a shift block in a day column. */
export function shiftPosition(
  shift: Shift,
  dayStart: Date
): { top: number; height: number } {
  const start = new Date(shift.startDateTime);
  const end = new Date(shift.endDateTime);
  const dayStartWithHours = new Date(dayStart);
  dayStartWithHours.setHours(PLANNING_HOUR_START, 0, 0, 0);
  const topMinutes =
    (start.getTime() - dayStartWithHours.getTime()) / (60 * 1000);
  const durationMinutes = (end.getTime() - start.getTime()) / (60 * 1000);
  const top = Math.max(0, (topMinutes / MINUTES_PER_DAY) * 100);
  const height = Math.min((durationMinutes / MINUTES_PER_DAY) * 100, 100 - top);
  return { top, height: Math.max(height, 4) };
}

/** Short summary of required roles for a shift, e.g. "2 Nurses, 1 Doctor". */
export function requiredRolesSummary(shift: Shift): string {
  const parts = shift.requiredRoles.map(
    (r) => `${r.count} ${r.role.name}${r.count !== 1 ? "s" : ""}`
  );
  const total = shift.requiredRoles.reduce((s, r) => s + r.count, 0);
  if (total === 0) return "0 roles";
  if (parts.length <= 2) return parts.join(", ");
  return `${total} roles (${parts.join(", ")})`;
}
