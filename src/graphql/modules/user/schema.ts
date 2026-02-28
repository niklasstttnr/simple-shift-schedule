import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: DateTime!
    roles: [Role!]!
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(email: String!, name: String!): User!
    deleteUser(id: ID!): User!
    addRoleToUser(userId: ID!, roleId: ID!): User!
    removeRoleFromUser(userId: ID!, roleId: ID!): User!
  }
`;
