import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/graphql/types";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { useUsersQuery } from "@/hooks/use-users-query";
import { CreateUserModal } from "./CreateUserModal";
import { UserDetailModal } from "./UserDetailModal";
import { Plus } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
  {
    id: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles ?? [];
      if (roles.length === 0)
        return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-muted-foreground">
          {roles.map((r) => r.name).join(", ")}
        </span>
      );
    },
  },
];

export function UsersPage() {
  const { users, loading, error } = useUsersQuery();
  const [createOpen, setCreateOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="space-y-4">
      <DataTable<User>
        columns={columns}
        data={users}
        getRowId={(row) => row.id}
        header={
          <Button onClick={() => setCreateOpen(true)} size="sm">
              <Plus className="size-4" />
              Add user
            </Button>
        }
        emptyMessage="No users yet. Create one to get started."
        loading={loading}
        error={error ?? undefined}
        onRowClick={(row) => {
          setDetailUser(row);
          setDetailOpen(true);
        }}
      />

      <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />

      <UserDetailModal
        user={detailUser}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailUser(null);
        }}
        onUserUpdated={(updated) => setDetailUser(updated)}
        onUserDeleted={() => setDetailUser(null)}
      />
    </div>
  );
}
