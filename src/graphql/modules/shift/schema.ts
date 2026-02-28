import { gql } from 'graphql-tag';

export const shiftTypeDefs = gql`
  type ShiftRequiredRole {
    id: ID!
    role: Role!
    count: Int!
  }

  type ShiftAssignment {
    id: ID!
    user: User!
  }

  type Shift {
    id: ID!
    name: String!
    startDateTime: DateTime!
    endDateTime: DateTime!
    requiredRoles: [ShiftRequiredRole!]!
    assignments: [ShiftAssignment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input ShiftRequiredRoleInput {
    roleId: ID!
    count: Int!
  }

  extend type Query {
    shifts: [Shift!]!
    shift(id: ID!): Shift
  }

  extend type Mutation {
    createShift(
      name: String!
      startDateTime: DateTime!
      endDateTime: DateTime!
      requiredRoles: [ShiftRequiredRoleInput!]!
    ): Shift!
    updateShift(
      id: ID!
      name: String
      startDateTime: DateTime
      endDateTime: DateTime
      requiredRoles: [ShiftRequiredRoleInput!]
    ): Shift!
    deleteShift(id: ID!): Shift!
    assignUserToShift(shiftId: ID!, userId: ID!): Shift!
    removeUserFromShift(shiftId: ID!, userId: ID!): Shift!
    addRequiredRoleToShift(shiftId: ID!, roleId: ID!, count: Int!): Shift!
    removeRequiredRoleFromShift(shiftId: ID!, roleId: ID!): Shift!
    updateRequiredRoleCount(shiftId: ID!, roleId: ID!, count: Int!): Shift!
  }
`;
