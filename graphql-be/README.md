# base-graphql

Node.js + TypeScript + Apollo Server + Prisma + PostgreSQL. GraphQL API with domain-grouped queries and mutations (user, role, shift).

## Prerequisites

- Node.js ≥ 20
- PostgreSQL (or use Docker)

## Setup

```bash
cp env.example .env
# Edit .env if your database URL differs (use localhost for local dev)

npm install
npm run prisma:generate
npm run prisma:migrate
```

## Run locally

```bash
# Start Postgres (if using Docker for DB only)
docker compose up -d postgres

npm run dev
```

API: **http://localhost:4000** — Apollo Sandbox available in development.

## Run with Docker

From this folder (Postgres + API only):

```bash
docker compose up -d
```

API: **http://localhost:4000**. `DATABASE_URL` is set in `docker-compose.yml` so the API uses the `postgres` service.

To run **all services** (Postgres + API + frontend) from the repo root, see the [root README](../README.md#docker-all-services-from-repo-root).

## API shape

Operations are grouped by domain:

| Domain | Query | Mutation |
|--------|--------|----------|
| **user** | `user { users, user(id) }` | `user { createUser, deleteUser, addRoleToUser, removeRoleFromUser }` |
| **role** | `role { roles, role(id) }` | `role { createRole, deleteRole }` |
| **shift** | `shift { shifts, shift(id) }` | `shift { createShift, updateShift, deleteShift, assignUserToShift, ... }` |

Example:

```graphql
query {
  user { users { id name email } }
  shift { shifts { id name startDateTime } }
}
```

## Scripts

| Command | Description |
|---------|--------------|
| `npm run dev` | Start with hot reload (tsx) |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled app |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations |
| `npm run format` | Format with Prettier |
