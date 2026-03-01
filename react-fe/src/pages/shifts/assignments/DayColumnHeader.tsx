import type { Shift } from "@/graphql/types";
import { getDayStaffingSummary, getDayRoleStaffing } from "./assignments-utils";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, AlertCircle } from "lucide-react";

export type DayColumnHeaderProps = {
  day: Date;
  shifts: Shift[];
  isToday: boolean;
};

export function DayColumnHeader({
  day,
  shifts,
  isToday,
}: DayColumnHeaderProps) {
  const summary = getDayStaffingSummary(shifts);
  const roleStaffing = getDayRoleStaffing(shifts);
  const allFullyStaffed =
    summary.shiftCount === 0 ||
    summary.fullyStaffedCount === summary.shiftCount;
  const iconTooltip =
    summary.shiftCount > 0
      ? allFullyStaffed
        ? `All roles assigned • ${summary.totalAssigned} users`
        : `${summary.fullyStaffedCount}/${summary.shiftCount} shifts fully staffed • ${summary.totalAssigned} users`
      : null;

  return (
    <div
      className={cn(
        "border-b border-border p-2 text-left text-xs font-medium",
        isToday && "bg-primary text-primary-foreground"
      )}
    >
      <div>{day.toLocaleDateString(undefined, { weekday: "short" })}</div>
      <div className="text-lg">{day.getDate()}</div>
      {summary.shiftCount > 0 && (
        <>
          <div
            className={cn(
              "mt-1 flex flex-col gap-0.5",
              isToday ? "text-primary-foreground/90" : "text-muted-foreground"
            )}
          >
            {roleStaffing.map(({ roleName, required, assigned }) => (
              <div
                key={roleName}
                className="truncate"
                title={`${roleName}: ${assigned} of ${required} assigned`}
              >
                {roleName} {assigned}/{required}
              </div>
            ))}
          </div>
          <div
            className={cn(
              "mt-1 flex items-center gap-1",
              isToday ? "text-primary-foreground/90" : "text-muted-foreground"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0 cursor-default">
                  {allFullyStaffed ? (
                    <Check className="size-3.5" />
                  ) : (
                    <AlertCircle className="size-3.5" />
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent>{iconTooltip}</TooltipContent>
            </Tooltip>
            <span>
              {summary.fullyStaffedCount}/{summary.shiftCount}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
