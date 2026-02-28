import { gql } from "graphql-tag";

export const roleTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  extend type Query {
    roles: [Role!]!
    role(id: ID!): Role
  }

  extend type Mutation {
    createRole(name: String!, description: String): Role!
    deleteRole(id: ID!): Role!
  }
`;