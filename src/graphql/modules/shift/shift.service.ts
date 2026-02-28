import type {
  PrismaClient,
  Role,
  Shift as PrismaShift,
  ShiftAssignment as PrismaShiftAssignment,
  ShiftRequiredRole as PrismaShiftRequiredRole,
  User,
} from '@prisma/client';

export type ShiftRequiredRoleInput = {
  roleId: string;
  count: number;
};

type UserWithRoles = User & {
  roles: Array<{ role: Role }>;
};

type ShiftAssignmentWithRelations = PrismaShiftAssignment & {
  user: UserWithRoles;
};

type ShiftRequiredRoleForShift = PrismaShiftRequiredRole & {
  role: Role;
};

export type ShiftWithRelations = PrismaShift & {
  requiredRoles: ShiftRequiredRoleForShift[];
  assignments: ShiftAssignmentWithRelations[];
};

const shiftInclude = {
  requiredRoles: {
    include: { role: true },
  },
  assignments: {
    include: {
      user: {
        include: {
          roles: {
            include: { role: true },
          },
        },
      },
    },
  },
} as const;

export class ShiftService {
  constructor(private prisma: PrismaClient) {}

  async getAllShifts(): Promise<ShiftWithRelations[]> {
    return this.prisma.shift.findMany({
      orderBy: { startDateTime: 'asc' },
      include: shiftInclude,
    });
  }

  async getShiftById(id: string): Promise<ShiftWithRelations | null> {
    return this.prisma.shift.findUnique({
      where: { id },
      include: shiftInclude,
    });
  }

  async createShift(
    name: string,
    startDateTime: Date,
    endDateTime: Date,
    requiredRoles: ShiftRequiredRoleInput[]
  ): Promise<ShiftWithRelations> {
    if (endDateTime <= startDateTime) {
      throw new Error('endDateTime must be after startDateTime.');
    }
    if (!requiredRoles.length) {
      throw new Error('At least one required role is needed.');
    }
    const roleIds = requiredRoles.map((r) => r.roleId);
    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } },
    });
    if (roles.length !== roleIds.length) {
      throw new Error('One or more role IDs are invalid.');
    }
    return this.prisma.shift.create({
      data: {
        name,
        startDateTime,
        endDateTime,
        requiredRoles: {
          create: requiredRoles.map((r) => ({
            roleId: r.roleId,
            count: r.count,
          })),
        },
      },
      include: shiftInclude,
    });
  }

  async updateShift(
    id: string,
    data: {
      name?: string;
      startDateTime?: Date;
      endDateTime?: Date;
      requiredRoles?: ShiftRequiredRoleInput[];
    }
  ): Promise<ShiftWithRelations> {
    const existing = await this.prisma.shift.findUnique({
      where: { id },
      include: { requiredRoles: true },
    });
    if (!existing) {
      throw new Error('Shift not found.');
    }
    if (
      data.startDateTime != null &&
      data.endDateTime != null &&
      data.endDateTime <= data.startDateTime
    ) {
      throw new Error('endDateTime must be after startDateTime.');
    }
    if (data.requiredRoles !== undefined) {
      if (data.requiredRoles.length === 0) {
        throw new Error('At least one required role is needed.');
      }
      const roleIds = data.requiredRoles.map((r) => r.roleId);
      const roles = await this.prisma.role.findMany({
        where: { id: { in: roleIds } },
      });
      if (roles.length !== roleIds.length) {
        throw new Error('One or more role IDs are invalid.');
      }
    }
    const updateData: Parameters<PrismaClient['shift']['update']>[0]['data'] = {
      ...(data.name != null && { name: data.name }),
      ...(data.startDateTime != null && { startDateTime: data.startDateTime }),
      ...(data.endDateTime != null && { endDateTime: data.endDateTime }),
    };
    if (data.requiredRoles !== undefined) {
      await this.prisma.shiftRequiredRole.deleteMany({
        where: { shiftId: id },
      });
      updateData.requiredRoles = {
        create: data.requiredRoles.map((r) => ({
          roleId: r.roleId,
          count: r.count,
        })),
      };
    }
    return this.prisma.shift.update({
      where: { id },
      data: updateData,
      include: shiftInclude,
    });
  }

  async deleteShift(id: string): Promise<ShiftWithRelations> {
    try {
      return await this.prisma.shift.delete({
        where: { id },
        include: shiftInclude,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new Error('Shift not found.');
      }
      throw error;
    }
  }

  async assignUserToShift(
    shiftId: string,
    userId: string
  ): Promise<ShiftWithRelations> {
    const [shift, user] = await Promise.all([
      this.prisma.shift.findUnique({
        where: { id: shiftId },
        include: { requiredRoles: true },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: { include: { role: true } },
        },
      }),
    ]);
    if (!shift) throw new Error('Shift not found.');
    if (!user) throw new Error('User not found.');

    try {
      await this.prisma.shiftAssignment.create({
        data: { shiftId, userId },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        throw new Error('User is already assigned to this shift.');
      }
      throw error;
    }
    return this.getShiftById(shiftId) as Promise<ShiftWithRelations>;
  }

  async removeUserFromShift(
    shiftId: string,
    userId: string
  ): Promise<ShiftWithRelations> {
    try {
      await this.prisma.shiftAssignment.delete({
        where: {
          shiftId_userId: { shiftId, userId },
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new Error('Assignment not found.');
      }
      throw error;
    }
    const shift = await this.getShiftById(shiftId);
    if (!shift) throw new Error('Shift not found.');
    return shift;
  }

  async addRequiredRoleToShift(
    shiftId: string,
    roleId: string,
    count: number
  ): Promise<ShiftWithRelations> {
    const [shift, role] = await Promise.all([
      this.prisma.shift.findUnique({ where: { id: shiftId } }),
      this.prisma.role.findUnique({ where: { id: roleId } }),
    ]);
    if (!shift) throw new Error('Shift not found.');
    if (!role) throw new Error('Role not found.');
    if (count < 1) throw new Error('Count must be at least 1.');

    try {
      await this.prisma.shiftRequiredRole.create({
        data: { shiftId, roleId, count },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        throw new Error('Role is already required for this shift.');
      }
      throw error;
    }
    const updated = await this.getShiftById(shiftId);
    if (!updated) throw new Error('Shift not found.');
    return updated;
  }

  async removeRequiredRoleFromShift(
    shiftId: string,
    roleId: string
  ): Promise<ShiftWithRelations> {
    try {
      await this.prisma.shiftRequiredRole.delete({
        where: {
          shiftId_roleId: { shiftId, roleId },
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new Error('Required role not found for this shift.');
      }
      throw error;
    }
    const shift = await this.getShiftById(shiftId);
    if (!shift) throw new Error('Shift not found.');
    return shift;
  }

  async updateRequiredRoleCount(
    shiftId: string,
    roleId: string,
    count: number
  ): Promise<ShiftWithRelations> {
    if (count < 1) throw new Error('Count must be at least 1.');

    try {
      await this.prisma.shiftRequiredRole.update({
        where: {
          shiftId_roleId: { shiftId, roleId },
        },
        data: { count },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new Error('Required role not found for this shift.');
      }
      throw error;
    }
    const shift = await this.getShiftById(shiftId);
    if (!shift) throw new Error('Shift not found.');
    return shift;
  }
}
