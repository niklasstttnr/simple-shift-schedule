import type { PrismaClient, Role, User } from '@prisma/client';

type UserWithRoles = User & {
  roles: Array<{
    role: Role;
  }>;
};

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getAllUsers(): Promise<UserWithRoles[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async getUserById(id: string): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async createUser(email: string, name: string): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          email,
          name,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        throw new Error('A user with this email already exists.');
      }
      throw error;
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new Error('User not found.');
      }
      throw error;
    }
  }

  async addRoleToUser(userId: string, roleId: string): Promise<UserWithRoles> {
    try {
      const updatedUser = await this.prisma.$transaction(async (tx) => {
        // Verify both exist
        const [user, role] = await Promise.all([
          tx.user.findUnique({ where: { id: userId } }),
          tx.role.findUnique({ where: { id: roleId } }),
        ]);

        if (!user) throw new Error('User not found.');
        if (!role) throw new Error('Role not found.');

        // Create the relationship
        await tx.userRole.create({
          data: {
            userId,
            roleId,
          },
        });

        // Return updated user
        const result = await tx.user.findUnique({
          where: { id: userId },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });

        if (!result) {
          throw new Error('User not found.');
        }

        return result;
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        const code = (error as { code: string }).code;
        if (code === 'P2002') {
          throw new Error('User already has this role.');
        }
      }
      // Re-throw custom errors
      if (error instanceof Error && error.message.includes('not found')) {
        throw error;
      }
      throw error;
    }
  }

  async removeRoleFromUser(
    userId: string,
    roleId: string
  ): Promise<UserWithRoles> {
    try {
      await this.prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
      });

      const updatedUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!updatedUser) {
        throw new Error('User not found.');
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        const code = (error as { code: string }).code;
        if (code === 'P2025') {
          throw new Error('User role not found.');
        }
      }
      throw error;
    }
  }
}
