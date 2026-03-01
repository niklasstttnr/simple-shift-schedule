# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Optional: pass at build time to set GraphQL URI in the built app (e.g. docker build --build-arg VITE_GRAPHQL_URI=https://api.example.com/graphql .)
ARG VITE_GRAPHQL_URI
ENV VITE_GRAPHQL_URI=$VITE_GRAPHQL_URI

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
