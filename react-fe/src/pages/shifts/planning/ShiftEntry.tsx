import type { Shift } from "@/graphql/types";
import { requiredRolesSummary } from "./planning-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Copy } from "lucide-react";

export type ShiftEntryProps = {
  shift: Shift;
  /** Position as percentage (0–100) of the day column height. */
  top: number;
  /** Height as percentage (0–100) of the day column height. */
  height: number;
  onEdit?: (shift: Shift) => void;
  onDuplicate?: (shift: Shift) => void;
};

export function ShiftEntry({
  shift,
  top,
  height,
  onEdit,
  onDuplicate,
}: ShiftEntryProps) {
  const summary = requiredRolesSummary(shift);
  const hasActions = onEdit ?? onDuplicate;

  return (
    <div
      className="absolute left-1 right-1 flex flex-col rounded border border-primary/30 bg-primary/15 px-2 py-1 text-xs pointer-events-auto"
      style={{
        top: `${top}%`,
        height: `${height}%`,
        minHeight: 20,
      }}
      title={`${shift.name} • ${summary}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-1">
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate">{shift.name}</div>
          <div className="text-muted-foreground truncate">{summary}</div>
        </div>
        {hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 opacity-70 hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
                aria-label="Shift actions"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(shift)}>
                  <Pencil className="size-4" />
                  Edit shift
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(shift)}>
                  <Copy className="size-4" />
                  Duplicate shift
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
