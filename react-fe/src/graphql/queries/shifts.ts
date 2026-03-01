import { gql } from "@apollo/client";

/** Uses existing shift schema: shift { shifts } with required fields for planning calendar. */
export const SHIFTS_QUERY = gql`
  query GetShifts {
    shift {
      shifts {
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
          user {
            id
            name
            roles {
              id
              name
            }
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;
