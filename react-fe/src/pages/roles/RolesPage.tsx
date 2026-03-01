import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Role } from "@/graphql/types";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { useRolesQuery } from "@/hooks/use-roles-query";
import { useRoleService } from "@/hooks/use-role-service";
import { CreateRoleModal } from "./CreateRoleModal";
import { DeleteRoleConfirmModal } from "./DeleteRoleConfirmModal";
import { Plus, Trash2 } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

export function RolesPage() {
  const { roles, loading, error } = useRolesQuery();
  const roleService = useRoleService();
  const [createOpen, setCreateOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const d = row.getValue("description") as string | null | undefined;
        return (
          <span className="text-muted-foreground">
            {d && d.trim() ? d : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Delete role ${row.original.name}`}
          onClick={(e) => {
            e.stopPropagation();
            setRoleToDelete(row.original);
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    },
  ];

  async function handleConfirmDelete() {
    if (!roleToDelete) return;
    setDeleteBusy(true);
    try {
      await roleService.deleteRole(roleToDelete.id);
      setRoleToDelete(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <DataTable<Role>
        columns={columns}
        data={roles}
        getRowId={(row) => row.id}
        header={
          <Button onClick={() => setCreateOpen(true)} size="sm">
              <Plus className="size-4" />
              Add role
            </Button>
        }
        emptyMessage="No roles yet. Create one to get started."
        loading={loading}
        error={error ?? undefined}
      />

      <CreateRoleModal open={createOpen} onOpenChange={setCreateOpen} />

      <DeleteRoleConfirmModal
        role={roleToDelete}
        open={roleToDelete != null}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
        onConfirm={handleConfirmDelete}
        busy={deleteBusy}
      />
    </div>
  );
}
