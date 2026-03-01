import { useState, useMemo, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { useShiftsQuery } from "@/hooks/use-shifts-query";
import { useUsersQuery } from "@/hooks/use-users-query";
import { useShiftService } from "@/hooks/use-shift-service";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import type { Shift } from "@/graphql/types";
import {
  getMonday,
  dayKey,
  formatWeekRange,
  getWeekDays,
  isSameDay,
} from "@/lib/date-utils";
import {
  PLANNING_ROW_HEIGHT,
  PLANNING_HEADER_HEIGHT,
  PLANNING_HOUR_START,
  PLANNING_SLOT_MINUTES,
  PLANNING_SLOTS_PER_DAY,
  shiftInWeek,
  shiftDayIndex,
  shiftPosition,
} from "@/pages/shifts/planning/planning-utils";
import { UserTile } from "./UserTile";
import { AssignmentsShiftBlock } from "./AssignmentsShiftBlock";
import { DayColumnHeader } from "./DayColumnHeader";

export function AssignmentsPage() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [assignMessage, setAssignMessage] = useState<string | null>(null);
  const { shifts, loading: shiftsLoading, error: shiftsError } = useShiftsQuery();
  const { users, loading: usersLoading, error: usersError } = useUsersQuery();
  const shiftService = useShiftService();

  useEffect(() => {
    if (!assignMessage) return;
    const t = setTimeout(() => setAssignMessage(null), 4000);
    return () => clearTimeout(t);
  }, [assignMessage]);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const shiftsInWeek = useMemo(
    () => shifts.filter((s) => shiftInWeek(s, weekStart)),
    [shifts, weekStart]
  );
  const shiftsByDay = useMemo(() => {
    const map: Record<string, Shift[]> = {};
    weekDays.forEach((d) => (map[dayKey(d)] = []));
    shiftsInWeek.forEach((s) => {
      const idx = shiftDayIndex(s, weekStart);
      const day = weekDays[idx];
      if (day) map[dayKey(day)].push(s);
    });
    return map;
  }, [shiftsInWeek, weekDays, weekStart]);

  function goPrevWeek() {
    setWeekStart((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 7);
      return next;
    });
  }

  function goNextWeek() {
    setWeekStart((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 7);
      return next;
    });
  }

  function goToday() {
    setWeekStart(getMonday(new Date()));
  }

  async function handleAssign(shiftId: string, userId: string) {
    try {
      await shiftService.assignUserToShift(shiftId, userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("already assigned")) {
        setAssignMessage("This user is already assigned to this shift.");
        return;
      }
      throw err;
    }
  }

  function handleUnassign(shiftId: string, userId: string) {
    shiftService.removeUserFromShift(shiftId, userId);
  }

  const timeLabels = Array.from(
    { length: PLANNING_SLOTS_PER_DAY + 1 },
    (_, i) => PLANNING_HOUR_START + (i * PLANNING_SLOT_MINUTES) / 60
  ).map((h) => {
    const hour = Math.floor(h);
    const min = (h % 1) * 60;
    return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  });

  const isToday = (d: Date) => isSameDay(d, new Date());
  const loading = shiftsLoading || usersLoading;
  const error = shiftsError ?? usersError;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-2xl font-semibold text-foreground shrink-0">
            Assignments
          </h2>
          {assignMessage && (
            <span
              className="text-sm text-muted-foreground truncate"
              role="status"
              aria-live="polite"
            >
              {assignMessage}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goPrevWeek}
              aria-label="Previous week"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[140px] shrink-0 text-center text-sm font-medium text-foreground sm:min-w-[180px]">
              {formatWeekRange(weekStart)}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goNextWeek}
              aria-label="Next week"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Left: scrollable user list */}
        <aside className="w-56 shrink-0 rounded-lg border border-border bg-card/50 flex flex-col overflow-hidden">
          <div className="border-b border-border px-3 py-2 text-sm font-medium text-foreground">
            Team
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {users.length === 0 && !usersLoading && (
              <p className="text-sm text-muted-foreground">No users yet.</p>
            )}
            <ul className="flex flex-col gap-2">
              {users.map((user) => (
                <li key={user.id}>
                  <UserTile user={user} draggable />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right: week grid */}
        <div className="relative min-w-0 flex-1 overflow-x-auto rounded-lg border border-border bg-card/50">
          <div
            className="min-w-[600px]"
            style={{
              display: "grid",
              gridTemplateColumns: "56px repeat(7, minmax(0, 1fr))",
              gridTemplateRows: `auto repeat(${PLANNING_SLOTS_PER_DAY}, ${PLANNING_ROW_HEIGHT}px)`,
            }}
          >
            <div className="border-b border-r border-border bg-muted/30 p-1" />
            {weekDays.map((d) => (
              <DayColumnHeader
                key={dayKey(d)}
                day={d}
                shifts={shiftsByDay[dayKey(d)] ?? []}
                isToday={isToday(d)}
              />
            ))}
            {timeLabels.slice(0, -1).map((label, slotIndex) => (
              <Fragment key={slotIndex}>
                <div
                  className="border-r border-border bg-muted/20 px-1 py-0.5 text-right text-xs text-muted-foreground"
                  style={{ gridRow: slotIndex + 2 }}
                >
                  {label}
                </div>
                {weekDays.map((day) => (
                  <div
                    key={`${dayKey(day)}-${slotIndex}`}
                    className="relative border-r border-border last:border-r-0"
                    style={{ gridRow: slotIndex + 2 }}
                  />
                ))}
              </Fragment>
            ))}
          </div>

          {/* Shift blocks overlay */}
          <div
            className="absolute top-0 flex min-w-[600px] pointer-events-none"
            style={{
              left: 56,
              width: "calc(100% - 56px)",
              paddingTop: PLANNING_HEADER_HEIGHT,
              height: PLANNING_ROW_HEIGHT * PLANNING_SLOTS_PER_DAY,
            }}
          >
            {weekDays.map((day) => (
              <div key={dayKey(day)} className="relative flex-1">
                {(shiftsByDay[dayKey(day)] ?? []).map((shift) => {
                  const dayStart = new Date(day);
                  dayStart.setHours(0, 0, 0, 0);
                  const { top, height } = shiftPosition(shift, dayStart);
                  return (
                    <AssignmentsShiftBlock
                      key={shift.id}
                      shift={shift}
                      top={top}
                      height={height}
                      onAssign={handleAssign}
                      onUnassign={handleUnassign}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {loading && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="size-4 animate-pulse" />
                Loading…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
