import { gql } from "@apollo/client";

export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($name: String!, $description: String) {
    role {
      createRole(name: $name, description: $description) {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($id: ID!) {
    role {
      deleteRole(id: $id) {
        id
      }
    }
  }
`;
