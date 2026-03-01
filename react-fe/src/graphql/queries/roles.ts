import { gql } from "@apollo/client";

export const ROLES_QUERY = gql`
  query GetRoles {
    role {
      roles {
        id
        name
        description
      }
    }
  }
`;
