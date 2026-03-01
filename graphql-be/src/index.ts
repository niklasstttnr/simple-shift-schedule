import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';

import { ShiftService } from './graphql/modules/shift/shift.service.js';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { prisma } from './prisma/client.js';
import { UserService } from './graphql/modules/user/user.service.js';
import { env } from './config/env.js';
import type { GraphQLContext } from './types/context.js';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

async function main(): Promise<void> {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    introspection: true,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async (): Promise<GraphQLContext> => ({
        prisma,
        services: {
          userService: new UserService(prisma),
          shiftService: new ShiftService(prisma),
        },
      }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: env.PORT }, resolve)
  );

  console.log(`GraphQL server ready at http://localhost:${env.PORT}/graphql`);
}

main().catch(async (error) => {
  console.error('Failed to start server', error);
  await prisma.$disconnect().catch(() => {});
  process.exitCode = 1;
});
