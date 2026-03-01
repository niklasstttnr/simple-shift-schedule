import type { ApolloClient } from "@apollo/client/core";
import type { Shift } from "@/graphql/types";
import { SHIFTS_QUERY } from "@/graphql/queries/shifts";
import {
  ASSIGN_USER_TO_SHIFT_MUTATION,
  CREATE_SHIFT_MUTATION,
  DELETE_SHIFT_MUTATION,
  REMOVE_USER_FROM_SHIFT_MUTATION,
  UPDATE_SHIFT_MUTATION,
} from "@/graphql/mutations/shifts";

export type ShiftRequiredRoleInput = { roleId: string; count: number };

type CreateShiftMutationData = { shift: { createShift: Shift } };
type UpdateShiftMutationData = { shift: { updateShift: Shift } };
type AssignUserMutationData = { shift: { assignUserToShift: Shift } };
type RemoveUserMutationData = { shift: { removeUserFromShift: Shift } };
type DeleteShiftMutationData = { shift: { deleteShift: Shift } };

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
      if (!result.data?.shift?.createShift)
        throw new Error("Create shift failed");
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
      if (!result.data?.shift?.updateShift)
        throw new Error("Update shift failed");
      return result.data.shift.updateShift;
    },

    async deleteShift(id: string): Promise<Shift> {
      const result = await client.mutate<DeleteShiftMutationData>({
        mutation: DELETE_SHIFT_MUTATION,
        variables: { id },
        refetchQueries: [{ query: SHIFTS_QUERY }],
      });
      if (!result.data?.shift?.deleteShift)
        throw new Error("Delete shift failed");
      return result.data.shift.deleteShift;
    },

    async assignUserToShift(shiftId: string, userId: string): Promise<Shift> {
      const result = await client.mutate<AssignUserMutationData>({
        mutation: ASSIGN_USER_TO_SHIFT_MUTATION,
        variables: { shiftId, userId },
        refetchQueries: [{ query: SHIFTS_QUERY }],
      });
      if (!result.data?.shift?.assignUserToShift)
        throw new Error("Assign user failed");
      return result.data.shift.assignUserToShift;
    },

    async removeUserFromShift(shiftId: string, userId: string): Promise<Shift> {
      const result = await client.mutate<RemoveUserMutationData>({
        mutation: REMOVE_USER_FROM_SHIFT_MUTATION,
        variables: { shiftId, userId },
        refetchQueries: [{ query: SHIFTS_QUERY }],
      });
      if (!result.data?.shift?.removeUserFromShift)
        throw new Error("Remove user failed");
      return result.data.shift.removeUserFromShift;
    },
  };
}

export type ShiftService = ReturnType<typeof createShiftService>;
