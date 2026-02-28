import { UserService } from '../graphql/modules/user/user.service.js';
import type { prisma } from '../prisma/client.js';

export type GraphQLContext = {
  prisma: typeof prisma;
  services: {
    userService: UserService;
  };
};
