import { useQuery } from "@apollo/client/react";
import { USERS_QUERY } from "@/graphql/queries/users";
import type { User } from "@/graphql/types";

type UsersData = { user: { users: User[] } };

export function useUsersQuery() {
  const { data, loading, error } = useQuery<UsersData>(USERS_QUERY);
  const users = data?.user?.users ?? [];
  return { users, loading, error };
}
