import { DateTimeScalar } from './scalars/DateTime.js';
import { userResolvers } from './modules/user/resolvers.js';
import { roleResolvers } from './modules/role/resolver.js';

export const resolvers = {
  DateTime: DateTimeScalar,
  Query: {
    ...userResolvers.Query,
    ...roleResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...roleResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
};

