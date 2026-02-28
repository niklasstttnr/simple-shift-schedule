import { gql } from 'graphql-tag';

export const roleTypeDefs = gql`
  # ─────────────────────────────────────────────────────────────
  # Role domain
  # ─────────────────────────────────────────────────────────────

  """
  A role defines a job type or permission set (e.g. "Nurse", "Doctor").
  Roles are assigned to users and can be required on shifts.
  """
  type Role {
    """Unique identifier (CUID)."""
    id: ID!
    """Role name. Must be unique (e.g. "Nurse", "Doctor")."""
    name: String!
    """Optional description of the role's responsibilities."""
    description: String
    """When the role was created."""
    createdAt: DateTime!
    """When the role was last updated."""
    updatedAt: DateTime!
  }

  """
  Role domain queries. Access via query { role { ... } }.
  """
  type RoleQueries {
    """List all roles. Use when assigning roles to users or defining shift requirements."""
    roles: [Role!]!
    """Fetch a single role by ID. Returns null if not found."""
    role(id: ID!): Role
  }

  """
  Role domain mutations. Access via mutation { role { ... } }.
  """
  type RoleMutations {
    """Create a new role. Name must be unique."""
    createRole(name: String!, description: String): Role!
    """Permanently delete a role. Fails if the role is required by any shift."""
    deleteRole(id: ID!): Role!
  }
`;
