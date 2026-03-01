import type { ApolloClient } from "@apollo/client/core";
import type { User } from "@/graphql/types";
import {
  USERS_QUERY,
  USER_BY_ID_QUERY,
} from "@/graphql/queries/users";
import {
  CREATE_USER_MUTATION,
  ADD_ROLE_TO_USER_MUTATION,
  REMOVE_ROLE_FROM_USER_MUTATION,
  DELETE_USER_MUTATION,
} from "@/graphql/mutations/users";

type UsersQueryData = { user: { users: User[] } };
type UserByIdQueryData = { user: { user: User | null } };
type CreateUserMutationData = { user: { createUser: User } };
type AddRoleMutationData = { user: { addRoleToUser: User } };
type RemoveRoleMutationData = { user: { removeRoleFromUser: User } };
type DeleteUserMutationData = { user: { deleteUser: User } };

export function createUserService(client: ApolloClient) {
  return {
    async getUsers(): Promise<User[]> {
      const result = await client.query<UsersQueryData>({
        query: USERS_QUERY,
      });
      if (!result.data) throw new Error("Failed to fetch users");
      return result.data.user.users;
    },

    async getUserById(id: string): Promise<User | null> {
      const result = await client.query<UserByIdQueryData>({
        query: USER_BY_ID_QUERY,
        variables: { id },
      });
      if (!result.data) return null;
      return result.data.user.user;
    },

    async createUser(name: string, email: string): Promise<User> {
      const result = await client.mutate<CreateUserMutationData>({
        mutation: CREATE_USER_MUTATION,
        variables: { name, email },
        refetchQueries: [{ query: USERS_QUERY }],
      });
      if (!result.data) throw new Error("Create user failed");
      return result.data.user.createUser;
    },

    async addRoleToUser(userId: string, roleId: string): Promise<User> {
      const result = await client.mutate<AddRoleMutationData>({
        mutation: ADD_ROLE_TO_USER_MUTATION,
        variables: { userId, roleId },
        refetchQueries: [{ query: USERS_QUERY }, { query: USER_BY_ID_QUERY, variables: { id: userId } }],
      });
      if (!result.data) throw new Error("Add role failed");
      return result.data.user.addRoleToUser;
    },

    async removeRoleFromUser(userId: string, roleId: string): Promise<User> {
      const result = await client.mutate<RemoveRoleMutationData>({
        mutation: REMOVE_ROLE_FROM_USER_MUTATION,
        variables: { userId, roleId },
        refetchQueries: [{ query: USERS_QUERY }, { query: USER_BY_ID_QUERY, variables: { id: userId } }],
      });
      if (!result.data) throw new Error("Remove role failed");
      return result.data.user.removeRoleFromUser;
    },

    async deleteUser(id: string): Promise<User> {
      const result = await client.mutate<DeleteUserMutationData>({
        mutation: DELETE_USER_MUTATION,
        variables: { id },
        refetchQueries: [{ query: USERS_QUERY }],
      });
      if (!result.data) throw new Error("Delete user failed");
      return result.data.user.deleteUser;
    },
  };
}

export type UserService = ReturnType<typeof createUserService>;
