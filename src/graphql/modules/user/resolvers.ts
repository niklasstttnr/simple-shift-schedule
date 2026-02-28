import type { Role, User } from '@prisma/client';
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

type AddRoleToUserArgs = {
  userId: string;
  roleId: string;
};

type RemoveRoleFromUserArgs = {
  userId: string;
  roleId: string;
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
        include: {
          roles: true,
        },
      });
    },
    user: async (
      _parent: ResolversParent,
      args: UserArgs,
      ctx: GraphQLContext,
    ): Promise<User | null> => {
      return ctx.prisma.user.findUnique({
        where: { id: args.id },
        include: {
          roles: true,
        },
      });
    },
  },
  User: {
    roles: (parent: User & { roles: Array<{ role: Role }> }) => {
      return parent.roles.map((userRole) => userRole.role);
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
    addRoleToUser: async (
      _parent: ResolversParent,
      args: AddRoleToUserArgs,
      ctx: GraphQLContext,
    ): Promise<User> => {
      try {
        const updatedUser = await ctx.prisma.$transaction(async (tx) => {
          // Verify both exist
          const [user, role] = await Promise.all([
            tx.user.findUnique({ where: { id: args.userId } }),
            tx.role.findUnique({ where: { id: args.roleId } }),
          ]);
    
          if (!user) throw new Error('User not found.');
          if (!role) throw new Error('Role not found.');
    
          // Create the relationship
          await tx.userRole.create({
            data: {
              userId: args.userId,
              roleId: args.roleId,
            },
          });
    
          // Return updated user
          return tx.user.findUnique({
            where: { id: args.userId },
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          });
        });

        if (!updatedUser) {
          throw new Error('User not found.');
        }

        return updatedUser;
      } catch (error) {
        if (error instanceof Error && 'code' in error) {
          const code = (error as { code: string }).code;
          if (code === 'P2002') {
            throw new Error('User already has this role.');
          }
        }
        // Re-throw custom errors
        if (error instanceof Error && error.message.includes('not found')) {
          throw error;
        }
        throw new Error('Failed to add role to user.');
      }
    },
    removeRoleFromUser: async (
      _parent: ResolversParent,
      args: RemoveRoleFromUserArgs,
      ctx: GraphQLContext,
    ): Promise<User> => {
      const deletedUserRole = await ctx.prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId: args.userId,
            roleId: args.roleId,
          },
        },
      });

      if (!deletedUserRole) {
        throw new Error('User role not found.');
      }

      const updatedUser = await ctx.prisma.user.findUnique({
        where: { id: args.userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!updatedUser) {
        throw new Error('User not found.');
      }

      return updatedUser;
    },
  },
};
