'use server';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { LocationRoleEnum } from '@/domain/LocationRole.enum';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';

export async function getDifficultyLevels(locationId: number) {
  return prisma.difficultyLevel.findMany({
    where: { locationId },
    orderBy: { order: 'asc' },
  });
}

export async function createDifficultyLevel(
  locationId: number,
  data: { name: string; color?: string; points?: number }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const hasAccess = await checkUserLocationRole(userId, locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  const count = await prisma.difficultyLevel.count({ where: { locationId } });

  return prisma.difficultyLevel.create({
    data: {
      locationId,
      name: data.name,
      color: data.color ?? null,
      points: data.points ?? 0,
      order: count + 1,
    },
  });
}

export async function updateDifficultyLevel(
  id: number,
  data: { name?: string; color?: string; points?: number }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const level = await prisma.difficultyLevel.findUnique({ where: { id } });
  if (!level) return { error: 'Not found' };

  const hasAccess = await checkUserLocationRole(userId, level.locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  return prisma.difficultyLevel.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.points !== undefined && { points: data.points }),
    },
  });
}

export async function reorderDifficultyLevels(locationId: number, orderedIds: number[]) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const hasAccess = await checkUserLocationRole(userId, locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  await prisma.$transaction([
    prisma.$executeRaw`
      UPDATE difficulty_levels SET "order" = -"order"
      WHERE id IN (${Prisma.join(orderedIds)})
    `,
    prisma.$executeRaw`
      UPDATE difficulty_levels SET "order" = CASE id
        ${Prisma.join(orderedIds.map((id, i) => Prisma.sql`WHEN ${id} THEN ${i + 1}`), ' ')}
      END
      WHERE id IN (${Prisma.join(orderedIds)})
    `,
  ]);

  return { success: true as const };
}

export async function deleteDifficultyLevel(id: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'Unauthorized' };

  const level = await prisma.difficultyLevel.findUnique({ where: { id } });
  if (!level) return { error: 'Not found' };

  const hasAccess = await checkUserLocationRole(userId, level.locationId, LocationRoleEnum.Enum.admin);
  if (!hasAccess) return { error: 'Forbidden' };

  const trackCount = await prisma.track.count({ where: { difficultyLevelId: id } });
  if (trackCount > 0) return { error: 'Cannot delete: tracks are using this difficulty level' };

  await prisma.difficultyLevel.delete({ where: { id } });

  return { success: true as const };
}
