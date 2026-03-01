import { useApolloClient } from "@apollo/client/react";
import { useMemo } from "react";
import { createUserService } from "@/services/user.service";

export function useUserService() {
  const client = useApolloClient();
  return useMemo(() => createUserService(client), [client]);
}
