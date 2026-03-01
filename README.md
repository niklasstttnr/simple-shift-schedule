# base-graphql

Full-stack app: GraphQL API (Node.js + Apollo + Prisma) and React frontend (Vite + Tailwind + shadcn/ui).

## Repo structure

| Project                         | Description                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| **[graphql-be](./graphql-be/)** | Backend GraphQL API — Apollo Server, Prisma, PostgreSQL. Domains: user, role, shift. |
| **[react-fe](./react-fe/)**     | Frontend — React 19, Vite, Tailwind CSS, shadcn/ui, Apollo Client.                   |

Each project has its own **README** with setup, scripts, and details:

- **[Backend README](./graphql-be/README.md)** — Prerequisites, DB setup, migrations, API shape.
- **[Frontend README](./react-fe/README.md)** — Stack, run locally, project structure, shadcn.

## Quick start (both apps locally)

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

## Docker (all services from repo root)

A single **docker-compose** in the repo root runs Postgres, the API, and the frontend.

1. Copy the env example and edit if needed (DB user/password):

   ```bash
   cp .env.example .env
   ```

2. Start everything:

   ```bash
   docker compose up --build
   ```

- **Postgres** — port `5432` (credentials from `.env`)
- **API** — [http://localhost:4000](http://localhost:4000) (GraphQL at `/graphql`)
- **Frontend** — [http://localhost](http://localhost) (port 80). On Linux, if port 80 needs sudo, change the frontend port in docker-compose to `"8080:80"` and use http://localhost:8080

**First-time setup:** apply database migrations before using the API. With Postgres already running (e.g. via `docker compose up -d postgres`), run migrations using the same DB user, password, and db name as in your root `.env`:

```bash
cd graphql-be
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres npm run prisma:migrate
```

If you changed `POSTGRES_USER`, `POSTGRES_PASSWORD`, or `POSTGRES_DB` in `.env`, set `DATABASE_URL` accordingly.

Then start the rest: `docker compose up --build` (or start `api` and `frontend` if postgres is already up).

For per-project setup and scripts, see the READMEs linked above.
