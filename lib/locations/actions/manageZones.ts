'use server';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { LocationRoleEnum } from '@/domain/LocationRole.enum';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';

export async function getZones(locationId: number) {
  return prisma.zone.findMany({
    where: { locationId },
    orderBy: { order: 'asc' },
  });
}

export async function createZone(locationId: number, data: { name: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const hasAccess = await checkUserLocationRole(userId, locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  const count = await prisma.zone.count({ where: { locationId } });
  if (count >= 50) return { error: 'Max 50 zones reached' };

  const maxOrder = await prisma.zone.aggregate({
    where: { locationId },
    _max: { order: true },
  });

  return prisma.zone.create({
    data: {
      locationId,
      name: data.name,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
}

export async function updateZone(
  id: number,
  data: { name?: string; miniMapUrl?: string }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const zone = await prisma.zone.findUnique({ where: { id } });
  if (!zone) return { error: 'Not found' };

  const hasAccess = await checkUserLocationRole(userId, zone.locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  return prisma.zone.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.miniMapUrl !== undefined && { miniMapUrl: data.miniMapUrl }),
    },
  });
}

export async function reorderZones(locationId: number, orderedIds: number[]) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const hasAccess = await checkUserLocationRole(userId, locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  await prisma.$transaction([
    prisma.$executeRaw`
      UPDATE zones SET "order" = -"order"
      WHERE id IN (${Prisma.join(orderedIds)})
    `,
    prisma.$executeRaw`
      UPDATE zones SET "order" = CASE id
        ${Prisma.join(orderedIds.map((id, i) => Prisma.sql`WHEN ${id} THEN ${i + 1}`), ' ')}
      END
      WHERE id IN (${Prisma.join(orderedIds)})
    `,
  ]);

  return { success: true as const };
}

export async function getTracksCountByZone(zoneId: number) {
  return prisma.track.count({ where: { zoneId } });
}

export async function deleteZone(id: number, migrateToZoneId: number | null) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const zone = await prisma.zone.findUnique({ where: { id } });
  if (!zone) return { error: 'Not found' };

  const hasAccess = await checkUserLocationRole(userId, zone.locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  const trackCount = await prisma.track.count({ where: { zoneId: id } });

  if (trackCount > 0 && migrateToZoneId === null) {
    return { error: 'Must select migration zone' };
  }

  if (trackCount > 0 && migrateToZoneId !== null) {
    await prisma.track.updateMany({
      where: { zoneId: id },
      data: { zoneId: migrateToZoneId },
    });
  }

  await prisma.zone.delete({ where: { id } });

  if (zone.miniMapUrl) {
    await deleteImageFromCloudinary(zone.miniMapUrl);
  }

  return { success: true as const };
}
