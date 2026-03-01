import type { ApolloClient } from "@apollo/client/core";
import type { Shift } from "@/graphql/types";
import { SHIFTS_QUERY } from "@/graphql/queries/shifts";
import {
  CREATE_SHIFT_MUTATION,
  UPDATE_SHIFT_MUTATION,
} from "@/graphql/mutations/shifts";

export type ShiftRequiredRoleInput = { roleId: string; count: number };

type CreateShiftMutationData = { shift: { createShift: Shift } };
type UpdateShiftMutationData = { shift: { updateShift: Shift } };

export function createShiftService(client: ApolloClient) {
  return {
    async createShift(
      name: string,
      startDateTime: string,
      endDateTime: string,
      requiredRoles: ShiftRequiredRoleInput[]
    ): Promise<Shift> {
      const result = await client.mutate<CreateShiftMutationData>({
        mutation: CREATE_SHIFT_MUTATION,
        variables: {
          name,
          startDateTime,
          endDateTime,
          requiredRoles,
        },
        refetchQueries: [{ query: SHIFTS_QUERY }],
      });
      if (!result.data?.shift?.createShift) throw new Error("Create shift failed");
      return result.data.shift.createShift;
    },

    async updateShift(
      id: string,
      updates: {
        name?: string;
        startDateTime?: string;
        endDateTime?: string;
        requiredRoles?: ShiftRequiredRoleInput[];
      }
    ): Promise<Shift> {
      const result = await client.mutate<UpdateShiftMutationData>({
        mutation: UPDATE_SHIFT_MUTATION,
        variables: { id, ...updates },
        refetchQueries: [{ query: SHIFTS_QUERY }],
      });
      if (!result.data?.shift?.updateShift) throw new Error("Update shift failed");
      return result.data.shift.updateShift;
    },
  };
}

export type ShiftService = ReturnType<typeof createShiftService>;
