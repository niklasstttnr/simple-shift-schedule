import { gql } from 'graphql-tag';
import { roleTypeDefs } from './modules/role/schema.js';
import { shiftTypeDefs } from './modules/shift/schema.js';
import { userTypeDefs } from './modules/user/schema.js';

const baseTypeDefs = gql`
  scalar DateTime

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, userTypeDefs, roleTypeDefs, shiftTypeDefs];
