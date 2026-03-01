import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer } from '@apollo/server';

import { ShiftService } from './graphql/modules/shift/shift.service.js';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { prisma } from './prisma/client.js';
import { UserService } from './graphql/modules/user/user.service.js';
import { env } from './config/env.js';
import type { GraphQLContext } from './types/context.js';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

async function main(): Promise<void> {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    // Remove this plugin in real production - TESTNG ONLY
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    introspection: true,
  });

  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: env.PORT },
      context: async (): Promise<GraphQLContext> => ({
        prisma,
        services: {
          userService: new UserService(prisma),
          shiftService: new ShiftService(prisma),
        },
      }),
    });

    console.log(`GraphQL server ready at ${url}`);
  } catch (error) {
    console.error('Failed to start server', error);
    await prisma.$disconnect().catch(() => {
      // ignore
    });
    process.exitCode = 1;
  }
}

void main();
