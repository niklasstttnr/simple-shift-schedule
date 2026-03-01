/**
 * GraphQL domain types matching the backend schema.
 */

export type Role = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  roles: Role[];
};

export type ShiftRequiredRole = {
  id: string;
  role: Role;
  count: number;
};

export type ShiftAssignment = {
  id: string;
  user: User;
};

export type Shift = {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  requiredRoles: ShiftRequiredRole[];
  assignments: ShiftAssignment[];
  createdAt: string;
  updatedAt: string;
};
