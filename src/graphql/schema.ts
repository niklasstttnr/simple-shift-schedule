import { gql } from 'graphql-tag';
import { userTypeDefs } from './modules/user/schema.js';
import { roleTypeDefs } from './modules/role/schema.js';

const baseTypeDefs = gql`
  scalar DateTime

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, userTypeDefs, roleTypeDefs];
