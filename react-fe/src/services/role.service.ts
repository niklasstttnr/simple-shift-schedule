import type { ApolloClient } from "@apollo/client/core";
import type { Role } from "@/graphql/types";
import { ROLES_QUERY } from "@/graphql/queries/roles";
import {
  CREATE_ROLE_MUTATION,
  DELETE_ROLE_MUTATION,
} from "@/graphql/mutations/roles";

type RolesQueryData = { role: { roles: Role[] } };
type CreateRoleMutationData = { role: { createRole: Role } };
type DeleteRoleMutationData = { role: { deleteRole: Role } };

export function createRoleService(client: ApolloClient) {
  return {
    async getRoles(): Promise<Role[]> {
      const result = await client.query<RolesQueryData>({
        query: ROLES_QUERY,
      });
      if (!result.data) throw new Error("Failed to fetch roles");
      return result.data.role.roles;
    },

    async createRole(name: string, description: string | null): Promise<Role> {
      const result = await client.mutate<CreateRoleMutationData>({
        mutation: CREATE_ROLE_MUTATION,
        variables: { name, description: description || null },
        refetchQueries: [{ query: ROLES_QUERY }],
      });
      if (!result.data) throw new Error("Create role failed");
      return result.data.role.createRole;
    },

    async deleteRole(id: string): Promise<Role> {
      const result = await client.mutate<DeleteRoleMutationData>({
        mutation: DELETE_ROLE_MUTATION,
        variables: { id },
        refetchQueries: [{ query: ROLES_QUERY }],
      });
      if (!result.data) throw new Error("Delete role failed");
      return result.data.role.deleteRole;
    },
  };
}

export type RoleService = ReturnType<typeof createRoleService>;
