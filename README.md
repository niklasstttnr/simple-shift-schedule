# base-graphql

Full-stack app: GraphQL API (Node.js + Apollo + Prisma) and React frontend (Vite + Tailwind + shadcn/ui).

## Repo structure

| Project     | Description |
|------------|-------------|
| **[graphql-be](./graphql-be/)** | Backend GraphQL API — Apollo Server, Prisma, PostgreSQL. Domains: user, role, shift. |
| **[react-fe](./react-fe/)**     | Frontend — React 19, Vite, Tailwind CSS, shadcn/ui, Apollo Client. |

Each project has its own **README** with setup, scripts, and details:

- **[Backend README](./graphql-be/README.md)** — Prerequisites, DB setup, migrations, API shape, Docker.
- **[Frontend README](./react-fe/README.md)** — Stack, run locally, Docker, project structure, shadcn.

## Quick start (both apps)

1. **Backend** (API on port 4000):

   ```bash
   cd graphql-be
   cp env.example .env   # edit .env if needed
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

2. **Frontend** (app on port 5173):

   ```bash
   cd react-fe
   npm install
   npm run dev
   ```

   Frontend uses `http://localhost:4000/graphql` by default (see [react-fe README](./react-fe/README.md) for env).

For full setup, Docker, and scripts, see the READMEs linked above.
