/**
 * Date helpers for the planning calendar. All use local time to avoid UTC shift issues.
 */

/** Monday of the week containing d (week starts Monday). */
export function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - (day === 0 ? 7 : day) + 1;
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Local date string YYYY-MM-DD. Use for keys and form values (avoids UTC shift). */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Human-readable week range, e.g. "2 Mar – 8 Mar 2025". Adds year to both parts when the week spans two years. */
export function formatWeekRange(monday: Date): string {
  const sun = new Date(monday);
  sun.setDate(sun.getDate() + 6);
  const sameYear = monday.getFullYear() === sun.getFullYear();
  const mo = monday.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const su = sun.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${mo} – ${su}`;
}

/** Array of 7 dates (Mon–Sun) for the week starting with the given Monday. */
export function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  const d = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/** True if the two dates are the same local calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}
