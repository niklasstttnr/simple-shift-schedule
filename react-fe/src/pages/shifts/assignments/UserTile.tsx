import type { User } from "@/graphql/types";
import { setUserDragData } from "./assignments-utils";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type UserTileProps = {
  user: User;
  /** Compact mode for inside shift blocks (smaller, fewer details). */
  compact?: boolean;
  /** Show remove button (for assigned user in shift). */
  onRemove?: () => void;
  /** When true, tile is draggable (e.g. in user list). */
  draggable?: boolean;
  className?: string;
};

export function UserTile({
  user,
  compact = false,
  onRemove,
  draggable = false,
  className,
}: UserTileProps) {
  const roles = user.roles ?? [];

  function handleDragStart(e: React.DragEvent) {
    if (!draggable) return;
    setUserDragData(e.dataTransfer, user.id);
  }

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-muted/50 flex overflow-hidden min-w-0",
        compact ? "px-1.5 py-1" : "px-2 py-1.5",
        compact && onRemove && "w-full",
        draggable && "cursor-grab active:cursor-grabbing",
        onRemove && "pr-0",
        className
      )}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="min-w-0 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-1">
          <span
            className={cn(
              "font-medium truncate block",
              compact ? "text-xs" : "text-sm"
            )}
          >
            {user.name}
          </span>
        </div>
        {roles.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-0.5 mt-0.5",
              compact ? "text-[10px]" : "text-xs"
            )}
          >
            {roles.map((r) => (
              <span
                key={r.id}
                className="rounded bg-primary/20 text-primary px-1 font-medium"
              >
                {r.name}
              </span>
            ))}
          </div>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "shrink-0 flex items-center justify-center size-6 max-w-6 max-h-6 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            compact && "p-1"
          )}
          aria-label={`Remove ${user.name} from shift`}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
