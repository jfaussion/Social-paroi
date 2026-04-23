'use server';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { LocationRoleEnum } from '@/domain/LocationRole.enum';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';

export async function getHoldColors(locationId: number) {
  return prisma.holdColor.findMany({
    where: { locationId },
    orderBy: { order: 'asc' },
  });
}

export async function createHoldColor(
  locationId: number,
  data: { name: string; color: string }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const hasAccess = await checkUserLocationRole(userId, locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  const count = await prisma.holdColor.count({ where: { locationId } });

  return prisma.holdColor.create({
    data: {
      locationId,
      name: data.name,
      color: data.color,
      order: count + 1,
    },
  });
}

export async function updateHoldColor(
  id: number,
  data: { name?: string; color?: string }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const holdColor = await prisma.holdColor.findUnique({ where: { id } });
  if (!holdColor) return { error: 'Not found' };

  const hasAccess = await checkUserLocationRole(userId, holdColor.locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  return prisma.holdColor.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.color !== undefined && { color: data.color }),
    },
  });
}

export async function reorderHoldColors(locationId: number, orderedIds: number[]) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const hasAccess = await checkUserLocationRole(userId, locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  await prisma.$transaction([
    prisma.$executeRaw`
      UPDATE hold_colors SET "order" = -"order"
      WHERE id IN (${Prisma.join(orderedIds)})
    `,
    prisma.$executeRaw`
      UPDATE hold_colors SET "order" = CASE id
        ${Prisma.join(orderedIds.map((id, i) => Prisma.sql`WHEN ${id} THEN ${i + 1}`), ' ')}
      END
      WHERE id IN (${Prisma.join(orderedIds)})
    `,
  ]);

  return { success: true as const };
}

export async function deleteHoldColor(id: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const holdColor = await prisma.holdColor.findUnique({ where: { id } });
  if (!holdColor) return { error: 'Not found' };

  const hasAccess = await checkUserLocationRole(userId, holdColor.locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  const trackCount = await prisma.track.count({ where: { holdColorId: id } });
  if (trackCount > 0) return { error: 'Cannot delete: tracks are using this hold color' };

  await prisma.holdColor.delete({ where: { id } });

  return { success: true as const };
}
