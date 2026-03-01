import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
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
