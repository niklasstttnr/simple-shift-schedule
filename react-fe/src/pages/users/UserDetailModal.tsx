import { useState } from "react";
import type { Role, User } from "@/graphql/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserService } from "@/hooks/use-user-service";
import { useRolesQuery } from "@/hooks/use-roles-query";
import { Trash2, X } from "lucide-react";

type UserDetailModalProps = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated?: (user: User) => void;
  onUserDeleted?: () => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export function UserDetailModal({
  user,
  open,
  onOpenChange,
  onUserUpdated,
  onUserDeleted,
}: UserDetailModalProps) {
  const userService = useUserService();
  const { roles } = useRolesQuery();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const assignedRoleIds = new Set((user?.roles ?? []).map((r) => r.id));
  const availableRoles = roles.filter((r: Role) => !assignedRoleIds.has(r.id));

  async function handleAddRole() {
    if (!user || !selectedRoleId) return;
    setActionError(null);
    setBusy(true);
    try {
      const updated = await userService.addRoleToUser(user.id, selectedRoleId);
      onUserUpdated?.(updated);
      setSelectedRoleId("");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to add role"
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveRole(roleId: string) {
    if (!user) return;
    setActionError(null);
    setBusy(true);
    try {
      const updated = await userService.removeRoleFromUser(user.id, roleId);
      onUserUpdated?.(updated);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to remove role"
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirmDelete() {
    if (!user) return;
    setDeleteBusy(true);
    try {
      await userService.deleteUser(user.id);
      setDeleteConfirmOpen(false);
      onOpenChange(false);
      onUserDeleted?.();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete user"
      );
    } finally {
      setDeleteBusy(false);
    }
  }

  if (!user) return null;

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
          <DialogDescription>
            View and manage roles for this user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground font-medium">Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Created</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
          </dl>

          <div>
            <h4 className="text-foreground mb-2 text-sm font-medium">Roles</h4>
            {(user.roles ?? []).length === 0 ? (
              <p className="text-muted-foreground text-sm">No roles assigned.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {(user.roles ?? []).map((role) => (
                  <li
                    key={role.id}
                    className="bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-sm"
                  >
                    <span>{role.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove role ${role.name}`}
                      className="hover:bg-muted-foreground/20 rounded p-0.5 disabled:opacity-50"
                      onClick={() => handleRemoveRole(role.id)}
                      disabled={busy}
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-foreground text-sm font-medium">
              Assign role
            </h4>
            <div className="flex gap-2">
              <Select
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                disabled={availableRoles.length === 0 || busy}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role: Role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                onClick={handleAddRole}
                disabled={!selectedRoleId || busy}
              >
                Add
              </Button>
            </div>
            {actionError && (
              <p className="text-destructive text-sm">{actionError}</p>
            )}
          </div>

          <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={busy}
            >
              <Trash2 className="size-4" />
              Delete user
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>

    <ConfirmDeleteModal
      open={deleteConfirmOpen}
      onOpenChange={setDeleteConfirmOpen}
      title="Delete user"
      description={
        <>
          Are you sure you want to delete {user.name}? This action cannot be
          undone.
        </>
      }
      onConfirm={handleConfirmDelete}
      busy={deleteBusy}
    />
  </>
  );
}
