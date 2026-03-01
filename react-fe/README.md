# Shift Schedule Frontend

React 19 frontend with Vite, TypeScript, Tailwind CSS, shadcn/ui, and Apollo Client.

## Stack

- **React 19** with TypeScript
- **Vite** – build tool
- **Tailwind CSS** – styling (v4, PostCSS)
- **shadcn/ui** – component library (new-york style)
- **Apollo Client** – GraphQL

## Prerequisites

- Node.js 20+
- npm

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. (Optional) Configure the GraphQL endpoint. Copy the example env and edit if needed:

   ```bash
   cp .env.example .env
   ```

   Default: `http://localhost:4000/graphql` (via `VITE_GRAPHQL_URI`).

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app is at [http://localhost:5173](http://localhost:5173).

4. Build for production:

   ```bash
   npm run build
   ```

5. Preview the production build:

   ```bash
   npm run preview
   ```

## Run with Docker

From this folder (frontend only, port 3000):

```bash
docker compose up --build
```

To run **all services** (Postgres + API + frontend) from the repo root, see the [root README](../README.md#docker-all-services-from-repo-root).

Open [http://localhost:3000](http://localhost:3000).

To use a custom GraphQL endpoint in the built image, pass the env at **build** time:

```bash
docker build --build-arg VITE_GRAPHQL_URI=https://api.example.com/graphql -t shift-schedule-frontend .
docker run -p 3000:80 shift-schedule-frontend
```

Or with docker compose, set the build arg in `docker-compose.yml` or a `.env` file and rebuild.

## Project structure

```
src/
  components/
    ui/           # shadcn components
    common/       # shared reusable components
  pages/         # page-level components
  hooks/         # custom hooks
  graphql/
    queries/
    mutations/
  lib/
    apollo.ts     # Apollo Client setup
    utils.ts      # cn() for shadcn
  types/         # shared TypeScript types
  App.tsx
  main.tsx
```

## Scripts

| Command     | Description              |
| ----------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## Adding shadcn components

```bash
npx shadcn@latest add <component-name>
```

Example: `npx shadcn@latest add card dialog input`
