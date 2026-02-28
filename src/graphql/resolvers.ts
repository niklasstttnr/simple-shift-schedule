import { DateTimeScalar } from './scalars/DateTime.js';
import { roleResolvers } from './modules/role/resolver.js';
import { shiftResolvers } from './modules/shift/resolvers.js';
import { userResolvers } from './modules/user/resolvers.js';

export const resolvers = {
  DateTime: DateTimeScalar,
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
