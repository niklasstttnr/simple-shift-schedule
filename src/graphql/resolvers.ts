import { GraphQLScalarType, Kind } from 'graphql';
import type { User } from '@prisma/client';

import type { GraphQLContext } from '../index.js';

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO-8601 DateTime scalar',
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    throw new TypeError('DateTime must be a valid Date or ISO-8601 string');
  },
  parseValue(value: unknown): Date {
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }
    throw new TypeError('DateTime must be a valid Date or ISO-8601 string');
  },
  parseLiteral(ast: import('graphql').ValueNode): Date {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      const date = new Date(ast.value);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }
    throw new TypeError('DateTime must be a valid Date or ISO-8601 string');
  },
});

type ResolversParent = Record<string, unknown>;

type UserArgs = {
  id: string;
};

type CreateUserArgs = {
  email: string;
  name: string;
};

export const resolvers = {
  DateTime: DateTimeScalar,
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
  },
};

