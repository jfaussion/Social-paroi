'use server';
import prisma from '@/prisma';
import { UserRoleEnum } from '@/domain/UserRole.enum';

export async function checkUserLocationMembership(
  userId: string,
  locationId: number
): Promise<boolean> {
  if (!userId || !locationId) return false;
  if (!Number.isInteger(locationId) || locationId <= 0) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (user?.role === UserRoleEnum.Enum.super_admin) return true;

  const membership = await prisma.userLocation.findUnique({
    where: {
      userId_locationId: { userId, locationId }
    },
  });

  return !!membership;
}