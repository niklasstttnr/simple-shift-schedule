import { gql } from 'graphql-tag';

export const shiftTypeDefs = gql`
  # ─────────────────────────────────────────────────────────────
  # Shift domain
  # ─────────────────────────────────────────────────────────────

  """
  A time slot that requires staff with specific roles.
  Shifts have a start/end time, required roles (how many of each), and user assignments.
  """
  type Shift {
    """Unique identifier (CUID)."""
    id: ID!
    """Display name for the shift (e.g. "Morning Ward", "Night Shift")."""
    name: String!
    """When the shift starts (ISO 8601)."""
    startDateTime: DateTime!
    """When the shift ends (ISO 8601). Must be after startDateTime."""
    endDateTime: DateTime!
    """Roles required for this shift and how many of each (e.g. 2 Nurses, 1 Doctor)."""
    requiredRoles: [ShiftRequiredRole!]!
    """Users currently assigned to this shift."""
    assignments: [ShiftAssignment!]!
    """When the shift was created."""
    createdAt: DateTime!
    """When the shift was last updated."""
    updatedAt: DateTime!
  }

  """
  Links a role to a shift with a required count.
  E.g. "This shift needs 2 Nurses and 1 Doctor."
  """
  type ShiftRequiredRole {
    """Unique identifier (CUID)."""
    id: ID!
    """The role that is required."""
    role: Role!
    """How many people with this role are needed for the shift."""
    count: Int!
  }

  """
  A user assigned to work a shift.
  """
  type ShiftAssignment {
    """Unique identifier (CUID)."""
    id: ID!
    """The user assigned to this shift."""
    user: User!
  }

  """
  Input for defining a required role when creating or updating a shift.
  """
  input ShiftRequiredRoleInput {
    """ID of the role (from roles query)."""
    roleId: ID!
    """Number of people with this role needed for the shift."""
    count: Int!
  }

  """
  Shift domain queries. Access via query { shift { ... } }.
  """
  type ShiftQueries {
    """List all shifts, ordered by start time. Use for calendars and schedules."""
    shifts: [Shift!]!
    """Fetch a single shift by ID. Returns null if not found."""
    shift(id: ID!): Shift
  }

  """
  Shift domain mutations. Access via mutation { shift { ... } }.
  """
  type ShiftMutations {
    # --- Shift CRUD ---
    """
    Create a new shift. Requires at least one required role.
    endDateTime must be after startDateTime.
    """
    createShift(
      name: String!
      startDateTime: DateTime!
      endDateTime: DateTime!
      """At least one role required. E.g. [{ roleId: "...", count: 2 }]"""
      requiredRoles: [ShiftRequiredRoleInput!]!
    ): Shift!
    """Update shift details. Omit fields to leave unchanged."""
    updateShift(
      id: ID!
      name: String
      startDateTime: DateTime
      endDateTime: DateTime
      """Replaces all required roles. Omit to keep existing."""
      requiredRoles: [ShiftRequiredRoleInput!]
    ): Shift!
    """Permanently delete a shift. Cascades to assignments and required roles."""
    deleteShift(id: ID!): Shift!

    # --- Shift assignments (who works) ---
    """Assign a user to a shift. Idempotent if already assigned."""
    assignUserToShift(shiftId: ID!, userId: ID!): Shift!
    """Remove a user from a shift."""
    removeUserFromShift(shiftId: ID!, userId: ID!): Shift!

    # --- Shift required roles (staffing needs) ---
    """Add a role requirement to a shift (e.g. "need 2 more Nurses")."""
    addRequiredRoleToShift(shiftId: ID!, roleId: ID!, count: Int!): Shift!
    """Remove a role requirement from a shift."""
    removeRequiredRoleFromShift(shiftId: ID!, roleId: ID!): Shift!
    """Change how many of a role are required (e.g. 2 Nurses → 3 Nurses)."""
    updateRequiredRoleCount(shiftId: ID!, roleId: ID!, count: Int!): Shift!
  }
`;
