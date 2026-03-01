import { useApolloClient } from "@apollo/client/react";
import { useMemo } from "react";
import { createRoleService } from "@/services/role.service";

export function useRoleService() {
  const client = useApolloClient();
  return useMemo(() => createRoleService(client), [client]);
}
