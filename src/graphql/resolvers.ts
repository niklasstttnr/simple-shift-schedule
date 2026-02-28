import { DateTimeScalar } from './scalars/DateTime.js';
import { userResolvers } from './modules/user/resolvers.js';

export const resolvers = {
  DateTime: DateTimeScalar,
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};

