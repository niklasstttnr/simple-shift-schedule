import { useState, useMemo, useCallback, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { useShiftsQuery } from "@/hooks/use-shifts-query";
import { CreateShiftModal, type CreateShiftInitial } from "./CreateShiftModal";
import { EditShiftModal } from "./EditShiftModal";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import type { Shift } from "@/graphql/types";
import { cn } from "@/lib/utils";
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
} from "./planning-utils";
import { ShiftEntry } from "./ShiftEntry";

export function PlanningPage() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [createOpen, setCreateOpen] = useState(false);
  const [createInitial, setCreateInitial] = useState<CreateShiftInitial | null>(
    null
  );
  const [editShift, setEditShift] = useState<Shift | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { shifts, loading, error } = useShiftsQuery();

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
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  }

  function goNextWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  }

  function goToday() {
    setWeekStart(getMonday(new Date()));
  }

  const handleEditShift = useCallback((shift: Shift) => {
    setEditShift(shift);
    setEditOpen(true);
  }, []);

  const handleDuplicateShift = useCallback((shift: Shift) => {
    const start = new Date(shift.startDateTime);
    const end = new Date(shift.endDateTime);
    const pad = (n: number) => String(n).padStart(2, "0");
    setCreateInitial({
      name: shift.name,
      date: dayKey(start),
      startTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
      endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
      requiredRoles: shift.requiredRoles.map((r) => ({
        roleId: r.role.id,
        count: r.count,
      })),
    });
    setCreateOpen(true);
  }, []);

  function openCreateForSlot(day: Date, slotIndex: number) {
    const startMin =
      PLANNING_HOUR_START * 60 + slotIndex * PLANNING_SLOT_MINUTES;
    const sh = Math.floor(startMin / 60);
    const sm = startMin % 60;
    const endMin = startMin + PLANNING_SLOT_MINUTES;
    const eh = Math.floor(endMin / 60);
    const em = endMin % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    setCreateInitial({
      date: dayKey(day),
      startTime: `${pad(sh)}:${pad(sm)}`,
      endTime: `${pad(eh)}:${pad(em)}`,
    });
    setCreateOpen(true);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
        <h2 className="text-2xl font-semibold text-foreground">Planning</h2>
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
          <Button
            size="sm"
            onClick={() => {
              setCreateInitial(null);
              setCreateOpen(true);
            }}
          >
            <Plus className="size-4" />
            New shift
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <div className="relative overflow-x-auto rounded-lg border border-border bg-card/50">
        <div
          className="min-w-[600px]"
          style={{
            display: "grid",
            gridTemplateColumns: "56px repeat(7, minmax(0, 1fr))",
            gridTemplateRows: `auto repeat(${PLANNING_SLOTS_PER_DAY}, ${PLANNING_ROW_HEIGHT}px)`,
          }}
        >
          {/* Header: empty corner */}
          <div className="border-b border-r border-border bg-muted/30 p-1" />
          {/* Day headers */}
          {weekDays.map((d) => (
            <div
              key={dayKey(d)}
              className={cn(
                "border-b border-border p-2 text-center text-xs font-medium",
                isToday(d) && "bg-primary text-primary-foreground"
              )}
            >
              <div>{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
              <div className="text-lg">{d.getDate()}</div>
            </div>
          ))}
          {/* Time column + day columns */}
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
                  onClick={() => openCreateForSlot(day, slotIndex)}
                >
                  <div className="absolute inset-0 cursor-pointer rounded hover:bg-primary/5" />
                </div>
              ))}
            </Fragment>
          ))}
        </div>

        {/* Shift blocks overlay: aligned over day columns (start at 56px to skip time column) */}
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
                  <ShiftEntry
                    key={shift.id}
                    shift={shift}
                    top={top}
                    height={height}
                    onEdit={handleEditShift}
                    onDuplicate={handleDuplicateShift}
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
              Loading shifts…
            </div>
          </div>
        )}
      </div>

      <CreateShiftModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={createInitial}
        onSuccess={() => setCreateInitial(null)}
      />

      <EditShiftModal
        shift={editShift}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditShift(null);
        }}
        onSuccess={() => setEditShift(null)}
      />
    </div>
  );
}
