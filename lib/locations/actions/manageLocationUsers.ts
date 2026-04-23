'use server';
import prisma from '@/prisma';
import { auth } from '@/auth';
import { LocationRole, LocationRoleEnum } from '@/domain/LocationRole.enum';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';

export async function getLocationMembers(locationId: number) {
  const [members, roles] = await Promise.all([
    prisma.userLocation.findMany({
      where: { locationId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    }),
    prisma.userLocationRole.findMany({ where: { locationId } }),
  ]);

  return members.map((m) => ({
    ...m,
    role: (roles.find((r) => r.userId === m.userId)?.role ?? null) as LocationRole | null,
  }));
}

export async function setUserLocationRole(
  userId: string,
  locationId: number,
  role: LocationRole | null
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  const callerId = session?.user?.id;
  if (!callerId) return { error: 'Unauthorized' };

  if (callerId === userId) return { error: 'Cannot change your own role' };

  const hasAccess = await checkUserLocationRole(callerId, locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  if (role === null) {
    await prisma.userLocationRole.deleteMany({ where: { userId, locationId } });
  } else {
    await prisma.userLocationRole.upsert({
      where: { userId_locationId: { userId, locationId } },
      create: { userId, locationId, role },
      update: { role },
    });
  }

  return { success: true };
}

export async function removeUserFromLocation(
  userId: string,
  locationId: number
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  const callerId = session?.user?.id;
  if (!callerId) return { error: 'Unauthorized' };

  if (callerId === userId) return { error: 'Cannot remove yourself' };

  const hasAccess = await checkUserLocationRole(callerId, locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  await prisma.userLocationRole.deleteMany({ where: { userId, locationId } });
  await prisma.userLocation.deleteMany({ where: { userId, locationId } });

  return { success: true };
}
