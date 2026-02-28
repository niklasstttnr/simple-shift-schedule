import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: DateTime!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(email: String!, name: String!): User!
  }
`;

