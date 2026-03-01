import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

const prisma = new PrismaClient({
  // In Prisma v7+, the connection URL is provided via the client constructor
  datasourceUrl: env.DATABASE_URL,
  log:
    process.env.NODE_ENV === 'production'
      ? ['error']
      : ['query', 'error', 'warn'],
});

process.on('beforeExit', async () => {
  await prisma.$disconnect().catch(() => {
    // ignore
  });
});

export { prisma };
