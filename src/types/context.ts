import type { prisma } from '../prisma/client.js';

export type GraphQLContext = {
  prisma: typeof prisma;
};
