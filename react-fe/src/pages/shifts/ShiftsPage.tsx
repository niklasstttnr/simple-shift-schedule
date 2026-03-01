import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";

export function ShiftsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Shifts</h2>
      <p className="text-muted-foreground">
        Create and manage shifts, then assign your team from the planning view.
      </p>
      <Button asChild>
        <Link to="/shifts/planning">
          <CalendarRange className="size-4" />
          Open Planning
        </Link>
      </Button>
    </div>
  );
}
