import type { ApolloClient } from "@apollo/client/core";
import type { Role } from "@/graphql/types";
import { ROLES_QUERY } from "@/graphql/queries/roles";

type RolesQueryData = { role: { roles: Role[] } };

export function createRoleService(client: ApolloClient) {
  return {
    async getRoles(): Promise<Role[]> {
      const result = await client.query<RolesQueryData>({
        query: ROLES_QUERY,
      });
      if (!result.data) throw new Error("Failed to fetch roles");
      return result.data.role.roles;
    },
  };
}

export type RoleService = ReturnType<typeof createRoleService>;
