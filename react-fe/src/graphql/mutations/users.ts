import { gql } from "@apollo/client";

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $email: String!) {
    user {
      createUser(name: $name, email: $email) {
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

export const ADD_ROLE_TO_USER_MUTATION = gql`
  mutation AddRoleToUser($userId: ID!, $roleId: ID!) {
    user {
      addRoleToUser(userId: $userId, roleId: $roleId) {
        id
        name
        email
        roles {
          id
          name
        }
      }
    }
  }
`;

export const REMOVE_ROLE_FROM_USER_MUTATION = gql`
  mutation RemoveRoleFromUser($userId: ID!, $roleId: ID!) {
    user {
      removeRoleFromUser(userId: $userId, roleId: $roleId) {
        id
        name
        email
        roles {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    user {
      deleteUser(id: $id) {
        id
      }
    }
  }
`;
