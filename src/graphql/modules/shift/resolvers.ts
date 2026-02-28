import type { GraphQLContext } from '../../../types/context.js';
import type { ShiftWithRelations } from './shift.service.js';

type ResolversParent = Record<string, unknown>;

type ShiftArgs = { id: string };

type CreateShiftArgs = {
  name: string;
  startDateTime: string;
  endDateTime: string;
  requiredRoles: Array<{ roleId: string; count: number }>;
};

type UpdateShiftArgs = {
  id: string;
  name?: string;
  startDateTime?: string;
  endDateTime?: string;
  requiredRoles?: Array<{ roleId: string; count: number }>;
};

type DeleteShiftArgs = { id: string };

type AssignUserToShiftArgs = {
  shiftId: string;
  userId: string;
};

type RemoveUserFromShiftArgs = {
  shiftId: string;
  userId: string;
};

type AddRequiredRoleToShiftArgs = {
  shiftId: string;
  roleId: string;
  count: number;
};

type RemoveRequiredRoleFromShiftArgs = {
  shiftId: string;
  roleId: string;
};

type UpdateRequiredRoleCountArgs = {
  shiftId: string;
  roleId: string;
  count: number;
};

export const shiftResolvers = {
  ShiftQueries: {
    shifts: async (
      _parent: ResolversParent,
      _args: Record<string, never>,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations[]> => {
      return ctx.services.shiftService.getAllShifts();
    },
    shift: async (
      _parent: ResolversParent,
      args: ShiftArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations | null> => {
      return ctx.services.shiftService.getShiftById(args.id);
    },
  },
  ShiftMutations: {
    createShift: async (
      _parent: ResolversParent,
      args: CreateShiftArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations> => {
      return ctx.services.shiftService.createShift(
        args.name,
        new Date(args.startDateTime),
        new Date(args.endDateTime),
        args.requiredRoles
      );
    },
    updateShift: async (
      _parent: ResolversParent,
      args: UpdateShiftArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations> => {
      const { id, requiredRoles, ...rest } = args;
      return ctx.services.shiftService.updateShift(id, {
        ...(rest.name != null && { name: rest.name }),
        ...(rest.startDateTime != null && {
          startDateTime: new Date(rest.startDateTime),
        }),
        ...(rest.endDateTime != null && {
          endDateTime: new Date(rest.endDateTime),
        }),
        ...(requiredRoles != null && { requiredRoles }),
      });
    },
    deleteShift: async (
      _parent: ResolversParent,
      args: DeleteShiftArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations> => {
      return ctx.services.shiftService.deleteShift(args.id);
    },
    assignUserToShift: async (
      _parent: ResolversParent,
      args: AssignUserToShiftArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations> => {
      return ctx.services.shiftService.assignUserToShift(
        args.shiftId,
        args.userId
      );
    },
    removeUserFromShift: async (
      _parent: ResolversParent,
      args: RemoveUserFromShiftArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations> => {
      return ctx.services.shiftService.removeUserFromShift(
        args.shiftId,
        args.userId
      );
    },
    addRequiredRoleToShift: async (
      _parent: ResolversParent,
      args: AddRequiredRoleToShiftArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations> => {
      return ctx.services.shiftService.addRequiredRoleToShift(
        args.shiftId,
        args.roleId,
        args.count
      );
    },
    removeRequiredRoleFromShift: async (
      _parent: ResolversParent,
      args: RemoveRequiredRoleFromShiftArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations> => {
      return ctx.services.shiftService.removeRequiredRoleFromShift(
        args.shiftId,
        args.roleId
      );
    },
    updateRequiredRoleCount: async (
      _parent: ResolversParent,
      args: UpdateRequiredRoleCountArgs,
      ctx: GraphQLContext
    ): Promise<ShiftWithRelations> => {
      return ctx.services.shiftService.updateRequiredRoleCount(
        args.shiftId,
        args.roleId,
        args.count
      );
    },
  },
};
