import { gql } from "@apollo/client";

/** Uses existing shift schema: shift { createShift(...) }. */
export const CREATE_SHIFT_MUTATION = gql`
  mutation CreateShift(
    $name: String!
    $startDateTime: DateTime!
    $endDateTime: DateTime!
    $requiredRoles: [ShiftRequiredRoleInput!]!
  ) {
    shift {
      createShift(
        name: $name
        startDateTime: $startDateTime
        endDateTime: $endDateTime
        requiredRoles: $requiredRoles
      ) {
        id
        name
        startDateTime
        endDateTime
        requiredRoles {
          id
          role {
            id
            name
          }
          count
        }
        assignments {
          id
        }
        createdAt
        updatedAt
      }
    }
  }
`;

/** Uses existing shift schema: shift { updateShift(...) }. */
export const UPDATE_SHIFT_MUTATION = gql`
  mutation UpdateShift(
    $id: ID!
    $name: String
    $startDateTime: DateTime
    $endDateTime: DateTime
    $requiredRoles: [ShiftRequiredRoleInput!]
  ) {
    shift {
      updateShift(
        id: $id
        name: $name
        startDateTime: $startDateTime
        endDateTime: $endDateTime
        requiredRoles: $requiredRoles
      ) {
        id
        name
        startDateTime
        endDateTime
        requiredRoles {
          id
          role {
            id
            name
          }
          count
        }
        assignments {
          id
        }
        createdAt
        updatedAt
      }
    }
  }
`;

/** Uses existing shift schema: shift { deleteShift(...) }. */
export const DELETE_SHIFT_MUTATION = gql`
  mutation DeleteShift($id: ID!) {
    shift {
      deleteShift(id: $id) {
        id
      }
    }
  }
`;

export const ASSIGN_USER_TO_SHIFT_MUTATION = gql`
  mutation AssignUserToShift($shiftId: ID!, $userId: ID!) {
    shift {
      assignUserToShift(shiftId: $shiftId, userId: $userId) {
        id
        assignments {
          id
          user {
            id
            name
            roles {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const REMOVE_USER_FROM_SHIFT_MUTATION = gql`
  mutation RemoveUserFromShift($shiftId: ID!, $userId: ID!) {
    shift {
      removeUserFromShift(shiftId: $shiftId, userId: $userId) {
        id
        assignments {
          id
          user {
            id
            name
            roles {
              id
              name
            }
          }
        }
      }
    }
  }
`;
