import { gql } from "@apollo/client";

export const USERS_QUERY = gql`
  query GetUsers {
    user {
      users {
        id
        name
        email
        createdAt
        roles {
          id
          name
        }
      }
    }
  }
`;

export const USER_BY_ID_QUERY = gql`
  query GetUser($id: ID!) {
    user {
      user(id: $id) {
        id
        name
        email
        createdAt
        roles {
          id
          name
          description
        }
      }
    }
  }
`;
