# Simple-Shift-Schedule

**Shiftomatic** — a small full-stack app for planning and assigning shifts. Define roles, create shifts in a weekly calendar, and assign team members to shifts via drag-and-drop.

- **Backend:** Node.js, Apollo Server, GraphQL, Prisma, PostgreSQL
- **Frontend:** React 19, Vite, Tailwind CSS, shadcn/ui, Apollo Client

## Idea

The app helps you run a **shift schedule** for a team (e.g. bar, kitchen, retail):

1. **Roles** — Define job types (e.g. Bartender, Host, Chef). Each shift is tied to one role.
2. **Planning** — In a week view you create and edit shifts (date, time range, role). You can move between weeks and add as many shifts per day as you need.
3. **Assignments** — In another week view you see the same shifts and assign users to them (e.g. by dragging a team member onto a shift). Each assignment links a user to a shift for that role and time.

So: **Roles** → **Shifts** (planning) → **Assignments** (who works when). The frontend offers a **Team** page to manage users and a **Roles** page to manage roles; **Shifts → Planning** and **Shifts → Assignments** cover the rest of the workflow.

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
