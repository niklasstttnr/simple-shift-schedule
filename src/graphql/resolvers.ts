import { DateTimeScalar } from './scalars/DateTime.js';
import { roleResolvers } from './modules/role/resolver.js';
import { shiftResolvers } from './modules/shift/resolvers.js';
import { userResolvers } from './modules/user/resolvers.js';

export const resolvers = {
  DateTime: DateTimeScalar,
  Query: {
    ...userResolvers.Query,
    ...roleResolvers.Query,
    ...shiftResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...roleResolvers.Mutation,
    ...shiftResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  UserQueries: userResolvers.UserQueries,
  UserMutations: userResolvers.UserMutations,
  RoleQueries: roleResolvers.RoleQueries,
  RoleMutations: roleResolvers.RoleMutations,
  ShiftQueries: shiftResolvers.ShiftQueries,
  ShiftMutations: shiftResolvers.ShiftMutations,
};
