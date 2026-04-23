'use server';
import prisma from '@/prisma';

export async function getZonesByLocation(locationId: number) {
  return prisma.zone.findMany({
    where: { locationId },
    select: { id: true, name: true, order: true, miniMapUrl: true },
    orderBy: { order: 'asc' },
  });
}
