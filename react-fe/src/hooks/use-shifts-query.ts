import { useQuery } from "@apollo/client/react";
import { SHIFTS_QUERY } from "@/graphql/queries/shifts";
import type { Shift } from "@/graphql/types";

type ShiftsData = { shift: { shifts: Shift[] } };

export function useShiftsQuery() {
  const { data, loading, error } = useQuery<ShiftsData>(SHIFTS_QUERY);
  const shifts = data?.shift?.shifts ?? [];
  return { shifts, loading, error };
}
