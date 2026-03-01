import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  # ─────────────────────────────────────────────────────────────
  # User domain
  # ─────────────────────────────────────────────────────────────

  """
  A user in the system. Users can have roles and be assigned to shifts.
  """
  type User {
    """Unique identifier (CUID)."""
    id: ID!
    """User's email address. Must be unique across all users."""
    email: String!
    """Display name."""
    name: String!
    """When the user was created."""
    createdAt: DateTime!
    """Roles assigned to this user (e.g. "Nurse", "Doctor")."""
    roles: [Role!]!
  }

  """
  User domain queries. Access via query { user { ... } }.
  """
  type UserQueries {
    """List all users. Use for directories, dropdowns, etc."""
    users: [User!]!
    """Fetch a single user by ID. Returns null if not found."""
    user(id: ID!): User
  }

  """
  User domain mutations. Access via mutation { user { ... } }.
  """
  type UserMutations {
    """Create a new user. Email must be unique."""
    createUser(email: String!, name: String!): User!
    """Permanently delete a user. Cascades to role assignments and shift assignments."""
    deleteUser(id: ID!): User!
    """Assign a role to a user. Idempotent if already assigned."""
    addRoleToUser(userId: ID!, roleId: ID!): User!
    """Remove a role from a user."""
    removeRoleFromUser(userId: ID!, roleId: ID!): User!
  }
`;
