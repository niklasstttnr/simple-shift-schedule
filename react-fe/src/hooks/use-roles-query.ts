import { useQuery } from "@apollo/client/react";
import { ROLES_QUERY } from "@/graphql/queries/roles";
import type { Role } from "@/graphql/types";

type RolesData = { role: { roles: Role[] } };

export function useRolesQuery() {
  const { data, loading, error } = useQuery<RolesData>(ROLES_QUERY);
  const roles = data?.role?.roles ?? [];
  return { roles, loading, error };
}
