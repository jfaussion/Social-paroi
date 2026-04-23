'use server';
import prisma from '@/prisma';
import { processTrackStats } from './userStatsProcessor';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('getUserStats');

/**
 * Retrieves the statistics for a given user.
 * @param userId - The ID of the user.
 * @returns The processed statistics for the user.
 */
export async function getUserStats(userId: string, locationId: number) {
  logger.start({ userId });
  try {
    const userTrackStats = await prisma.userTrackProgress.findMany({
      where: {
        userId,
        status: 'DONE',
        track: {
          locationId,
        }
      },
      select: {
        track: {
          select: {
            removed: true,
            difficultyLevel: {
              select: {
                name: true,
                color: true,
                order: true,
              },
            },
          },
        },
      },
    });

    const totalMountedByDifficultyId = await prisma.track.groupBy({
      by: ['difficultyLevelId'],
      where: {
        removed: false,
        locationId,
      },
      _count: {
        _all: true,
      },
    });

    const difficultyIds = totalMountedByDifficultyId
      .map(g => g.difficultyLevelId)
      .filter((id): id is number => id !== null);

    const difficultyLevels = await prisma.difficultyLevel.findMany({
      where: { id: { in: difficultyIds } },
      select: { id: true, name: true, color: true, order: true },
    });

    const difficultyLevelMap = Object.fromEntries(
      difficultyLevels.map(dl => [dl.id, dl])
    );

    const totalMountedTracksByDifficulty = totalMountedByDifficultyId.map(g => ({
      difficultyLevel: g.difficultyLevelId !== null ? (difficultyLevelMap[g.difficultyLevelId] ?? null) : null,
      _count: g._count,
    }));

    const processStats = processTrackStats(userTrackStats, totalMountedTracksByDifficulty);

    logger.success({
      userId,
      trackCount: userTrackStats.length,
      groupedLevels: totalMountedByDifficultyId.length,
    });
    return processStats;
  } catch (error) {
    logger.error(error, { userId });
    throw error;
  }
};
