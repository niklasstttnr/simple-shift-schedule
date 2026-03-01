import type { Role } from "@/graphql/types";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";

type DeleteRoleConfirmModalProps = {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  busy: boolean;
};

export function DeleteRoleConfirmModal({
  role,
  open,
  onOpenChange,
  onConfirm,
  busy,
}: DeleteRoleConfirmModalProps) {
  if (!role) return null;

  return (
    <ConfirmDeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete role"
      description={
        <>
          Are you sure you want to delete <strong>{role.name}</strong>? This
          action cannot be undone.
        </>
      }
      onConfirm={onConfirm}
      busy={busy}
    />
  );
}
