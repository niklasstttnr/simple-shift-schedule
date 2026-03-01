import { gql } from 'graphql-tag';
import { roleTypeDefs } from './modules/role/schema.js';
import { shiftTypeDefs } from './modules/shift/schema.js';
import { userTypeDefs } from './modules/user/schema.js';

/**
 * Base GraphQL schema - scalars and root types.
 * API is grouped by domain: user, role, shift. Each domain has its own
 * query and mutation namespace (e.g. query { user { users } }, mutation { user { createUser(...) } }).
 */
const baseTypeDefs = gql`
  """
  ISO 8601 date-time string (e.g. "2025-02-28T14:00:00.000Z").
  Used for all timestamp fields.
  """
  scalar DateTime

  type Query {
    """User domain: list and fetch users."""
    user: UserQueries!
    """Role domain: list and fetch roles."""
    role: RoleQueries!
    """Shift domain: list and fetch shifts."""
    shift: ShiftQueries!
  }

  type Mutation {
    """User domain: create, delete, assign roles."""
    user: UserMutations!
    """Role domain: create and delete roles."""
    role: RoleMutations!
    """Shift domain: CRUD, assignments, required roles."""
    shift: ShiftMutations!
  }
`;

export const typeDefs = [baseTypeDefs, userTypeDefs, roleTypeDefs, shiftTypeDefs];
