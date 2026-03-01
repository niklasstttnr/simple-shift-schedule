import { useState } from "react";
import type { Shift } from "@/graphql/types";
import { requiredRolesSummary } from "@/pages/shifts/planning/planning-utils";
import { UserTile } from "./UserTile";
import { USER_DRAG_TYPE, getUserDragData } from "./assignments-utils";
import { cn } from "@/lib/utils";

export type AssignmentsShiftBlockProps = {
  shift: Shift;
  top: number;
  height: number;
  onAssign: (shiftId: string, userId: string) => void;
  onUnassign: (shiftId: string, userId: string) => void;
};

export function AssignmentsShiftBlock({
  shift,
  top,
  height,
  onAssign,
  onUnassign,
}: AssignmentsShiftBlockProps) {
  const [dragOver, setDragOver] = useState(false);
  const summary = requiredRolesSummary(shift);

  function handleDragOver(e: React.DragEvent) {
    if (e.dataTransfer.types.includes(USER_DRAG_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDragOver(true);
    }
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    setDragOver(false);
    e.preventDefault();
    const userId = getUserDragData(e.dataTransfer);
    if (userId) onAssign(shift.id, userId);
  }

  return (
    <div
      className={cn(
        "absolute left-1 right-1 flex flex-col gap-1 rounded border px-2 py-1 text-xs pointer-events-auto overflow-auto",
        dragOver
          ? "border-primary bg-primary/25"
          : "border-primary/30 bg-primary/15"
      )}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        minHeight: 28,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      title={`${shift.name} • ${summary} • Drop user to assign`}
    >
      <div className="font-medium truncate">{shift.name}</div>
      <div className="text-muted-foreground truncate text-[10px]">
        {summary}
      </div>
      <div className="flex flex-col gap-1 mt-0.5">
        {shift.assignments.map((a) => (
          <UserTile
            key={a.id}
            user={a.user}
            compact
            onRemove={() => onUnassign(shift.id, a.user.id)}
          />
        ))}
      </div>
    </div>
  );
}
