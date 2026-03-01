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
