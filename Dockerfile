FROM node:20-alpine AS base

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Install dependencies in a separate layer
FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json ./

RUN npm install --production=false

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Build stage
FROM deps AS build

RUN npm run prisma:generate
RUN npm run build

# Production image
FROM base AS runner

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY prisma ./prisma

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "dist/index.js"]

