import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarRange, UserPlus } from "lucide-react";

export function ShiftsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Shifts</h2>
      <p className="text-muted-foreground">
        Create and manage shifts in Planning, then assign your team in
        Assignments.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/shifts/planning">
            <CalendarRange className="size-4" />
            Planning
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/shifts/assignments">
            <UserPlus className="size-4" />
            Assignments
          </Link>
        </Button>
      </div>
    </div>
  );
}
