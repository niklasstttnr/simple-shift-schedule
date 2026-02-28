import { Role } from "@prisma/client";
import { GraphQLContext } from "../../../types/context.js";


type ResolversParent = Record<string, unknown>;

type RoleArgs = {
  id: string;
};

type CreateRoleArgs = {
  name: string;
  description: string;
};

type DeleteRoleArgs = {
  id: string;
};

export const roleResolvers = {
  Query: {
    roles: async (_parent: ResolversParent, _args: Record<string, never>, ctx: GraphQLContext): Promise<Role[]> => {
      return ctx.prisma.role.findMany(
        {orderBy: { createdAt: 'desc' },
        include: {
          users: true,
        },}
      );
    },
    role: async (_parent: ResolversParent, args: RoleArgs, ctx: GraphQLContext): Promise<Role | null> => {
      return ctx.prisma.role.findUnique({
        where: { id: args.id },
        include: {
          users: true,
        },
      });
    },
  },
  Mutation: {
    createRole: async (_parent: ResolversParent, args: CreateRoleArgs, ctx: GraphQLContext): Promise<Role> => {
      return ctx.prisma.role.create({
        data: {
          name: args.name,
          description: args.description,
        },
      });
    },
  },
  deleteRole: async (_parent: ResolversParent, args: DeleteRoleArgs, ctx: GraphQLContext): Promise<Role> => {
    return ctx.prisma.role.delete({
      where: { id: args.id },
    });
  },
};