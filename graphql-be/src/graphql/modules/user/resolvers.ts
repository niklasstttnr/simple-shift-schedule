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
    user: () => ({}),
  },
  Mutation: {
    user: () => ({}),
  },
  UserQueries: {
    users: async (
      _parent: ResolversParent,
      _args: Record<string, never>,
      ctx: GraphQLContext
    ): Promise<User[]> => {
      const userService = ctx.services.userService;
      return userService.getAllUsers();
    },
    user: async (
      _parent: ResolversParent,
      args: UserArgs,
      ctx: GraphQLContext
    ): Promise<User | null> => {
      const userService = ctx.services.userService;
      return userService.getUserById(args.id);
    },
  },
  User: {
    roles: (parent: User & { roles?: Array<{ role: Role }> }) => {
      return (parent.roles ?? []).map((userRole) => userRole.role);
    },
  },
  UserMutations: {
    createUser: async (
      _parent: ResolversParent,
      args: CreateUserArgs,
      ctx: GraphQLContext
    ): Promise<User> => {
      const userService = ctx.services.userService;
      return userService.createUser(args.email, args.name);
    },
    deleteUser: async (
      _parent: ResolversParent,
      args: DeleteUserArgs,
      ctx: GraphQLContext
    ): Promise<User> => {
      const userService = ctx.services.userService;
      return userService.deleteUser(args.id);
    },
    addRoleToUser: async (
      _parent: ResolversParent,
      args: AddRoleToUserArgs,
      ctx: GraphQLContext
    ): Promise<User> => {
      const userService = ctx.services.userService;
      return userService.addRoleToUser(args.userId, args.roleId);
    },
    removeRoleFromUser: async (
      _parent: ResolversParent,
      args: RemoveRoleFromUserArgs,
      ctx: GraphQLContext
    ): Promise<User> => {
      const userService = ctx.services.userService;
      return userService.removeRoleFromUser(args.userId, args.roleId);
    },
  },
};
