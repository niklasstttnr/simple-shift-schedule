import type { Shift } from "@/graphql/types";

const DRAG_TYPE_USER = "application/x-shift-user";

/** Data transfer key for drag-and-drop user onto shift. */
export const USER_DRAG_TYPE = DRAG_TYPE_USER;

export function setUserDragData(dataTransfer: DataTransfer, userId: string): void {
  dataTransfer.setData(DRAG_TYPE_USER, userId);
  dataTransfer.effectAllowed = "copy";
}

export function getUserDragData(dataTransfer: DataTransfer): string | null {
  return dataTransfer.getData(DRAG_TYPE_USER) || null;
}

/**
 * True if the shift has enough assigned users for each required role.
 * For each required role we need at least `count` assigned users who have that role.
 */
export function isShiftFullyStaffed(shift: Shift): boolean {
  for (const req of shift.requiredRoles) {
    const roleId = req.role.id;
    const assignedWithRole = shift.assignments.filter((a) =>
      a.user.roles?.some((r) => r.id === roleId)
    );
    if (assignedWithRole.length < req.count) return false;
  }
  return true;
}

export type DayStaffingSummary = {
  totalRequired: number;
  totalAssigned: number;
  fullyStaffedCount: number;
  shiftCount: number;
  /** Required roles for the day aggregated. */
  requiredByRole: { roleId: string; roleName: string; count: number }[];
};

/** Aggregate required roles across shifts by role id (sum of counts). */
export function getDayRequiredRolesBreakdown(
  shifts: Shift[]
): { roleId: string; roleName: string; count: number }[] {
  const byRole = new Map<string, { roleName: string; count: number }>();
  for (const shift of shifts) {
    for (const req of shift.requiredRoles) {
      const id = req.role.id;
      const name = req.role.name;
      const existing = byRole.get(id);
      if (existing) existing.count += req.count;
      else byRole.set(id, { roleName: name, count: req.count });
    }
  }
  return Array.from(byRole.entries())
    .map(([roleId, { roleName, count }]) => ({ roleId, roleName, count }))
    .sort((a, b) => a.roleName.localeCompare(b.roleName));
}

/** Per-role assigned vs required for a day: "Server 2/3" => 3 needed, 2 assigned. */
export type DayRoleStaffing = { roleId: string; roleName: string; required: number; assigned: number };

export function getDayRoleStaffing(shifts: Shift[]): DayRoleStaffing[] {
  const requiredByRole = new Map<string, { roleName: string; required: number }>();
  const assignedByRole = new Map<string, number>();

  for (const shift of shifts) {
    for (const req of shift.requiredRoles) {
      const id = req.role.id;
      const name = req.role.name;
      const r = requiredByRole.get(id);
      if (r) r.required += req.count;
      else requiredByRole.set(id, { roleName: name, required: req.count });
    }
    for (const a of shift.assignments) {
      for (const r of a.user.roles ?? []) {
        assignedByRole.set(r.id, (assignedByRole.get(r.id) ?? 0) + 1);
      }
    }
  }

  return Array.from(requiredByRole.entries())
    .map(([roleId, { roleName, required }]) => ({
      roleId,
      roleName,
      required,
      assigned: assignedByRole.get(roleId) ?? 0,
    }))
    .sort((a, b) => a.roleName.localeCompare(b.roleName));
}

/** Aggregate staffing for all shifts on a day. */
export function getDayStaffingSummary(shifts: Shift[]): DayStaffingSummary {
  let totalRequired = 0;
  let totalAssigned = 0;
  let fullyStaffedCount = 0;
  for (const shift of shifts) {
    const required = shift.requiredRoles.reduce((s, r) => s + r.count, 0);
    totalRequired += required;
    totalAssigned += shift.assignments.length;
    if (isShiftFullyStaffed(shift)) fullyStaffedCount += 1;
  }
  return {
    totalRequired,
    totalAssigned,
    fullyStaffedCount,
    shiftCount: shifts.length,
    requiredByRole: getDayRequiredRolesBreakdown(shifts),
  };
}
