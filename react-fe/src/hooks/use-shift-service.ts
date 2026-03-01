import { useApolloClient } from "@apollo/client/react";
import { useMemo } from "react";
import { createShiftService } from "@/services/shift.service";

export function useShiftService() {
  const client = useApolloClient();
  return useMemo(() => createShiftService(client), [client]);
}
