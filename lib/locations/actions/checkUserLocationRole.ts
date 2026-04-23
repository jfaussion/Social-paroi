'use server';
import prisma from '@/prisma';
import { LocationRole, LocationRoleEnum } from '@/domain/LocationRole.enum';
import { UserRoleEnum } from '@/domain/UserRole.enum';

export async function checkUserLocationRole(
  userId: string,
  locationId: number,
  minRole: LocationRole
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role === UserRoleEnum.Enum.super_admin) return true;

  const locationRole = await prisma.userLocationRole.findUnique({
    where: { userId_locationId: { userId, locationId } },
  });
  if (!locationRole) return false;

  const { role } = locationRole;
  if (minRole === LocationRoleEnum.Enum.opener) return role === LocationRoleEnum.Enum.opener || role === LocationRoleEnum.Enum.admin;
  return role === LocationRoleEnum.Enum.admin;
}
