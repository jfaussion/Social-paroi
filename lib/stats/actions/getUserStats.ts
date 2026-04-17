'use server';
import prisma from '@/prisma';
import { Track } from '@/domain/Track.schema';
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
            level: true,
            removed: true,
          },
        },
      },
    });

    const totalMountedTracksByDifficulty = await prisma.track.groupBy({
      by: ['level'],
      where: {
        removed: false,
        locationId,
      },
      _count: {
        _all: true,
      },
    });
    const processStats = processTrackStats(userTrackStats as { track: Track }[], totalMountedTracksByDifficulty as { _count: { _all: number }, level: string }[]);

    logger.success({
      userId,
      trackCount: userTrackStats.length,
      groupedLevels: totalMountedTracksByDifficulty.length,
    });
    return processStats;
  } catch (error) {
    logger.error(error, { userId });
    throw error;
  }
};
