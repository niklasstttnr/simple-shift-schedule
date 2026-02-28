import type { User } from '@prisma/client';
import type { GraphQLContext } from '../../../types/context.js';

type ResolversParent = Record<string, unknown>;

type UserArgs = {
  id: string;
};

type CreateUserArgs = {
  email: string;
  name: string;
};

type DeleteUserArgs = {
  id: string;
};

export const userResolvers = {
  Query: {
    users: async (
      _parent: ResolversParent,
      _args: Record<string, never>,
      ctx: GraphQLContext,
    ): Promise<User[]> => {
      return ctx.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },
    user: async (
      _parent: ResolversParent,
      args: UserArgs,
      ctx: GraphQLContext,
    ): Promise<User | null> => {
      return ctx.prisma.user.findUnique({
        where: { id: args.id },
      });
    },
  },
  Mutation: {
    createUser: async (
      _parent: ResolversParent,
      args: CreateUserArgs,
      ctx: GraphQLContext,
    ): Promise<User> => {
      const { email, name } = args;

      try {
        return await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });
      } catch (error) {
        // Basic unique constraint handling; in a real app you'd refine this
        if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2002') {
          throw new Error('A user with this email already exists.');
        }

        throw error;
      }
    },
    deleteUser: async (
      _parent: ResolversParent,
      args: DeleteUserArgs,
      ctx: GraphQLContext,
    ): Promise<User> => {
      try {
        return await ctx.prisma.user.delete({
          where: { id: args.id },
        });
      } catch (error) {
        if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
          throw new Error('User not found.');
        }
        throw error;
      }
    },
  },
};
