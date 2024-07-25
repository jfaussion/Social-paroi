'use server';
import { Track } from '@/domain/Track.schema';
import { PrismaClient } from '@prisma/client/edge';
import { processTrackStats } from './userStatsProcessor';

const prisma = new PrismaClient();

/**
 * Retrieves the statistics for a given user.
 * @param userId - The ID of the user.
 * @returns The processed statistics for the user.
 */
export async function getUserStats(userId: string) {
  // Query to get tracks and done by the user, and total done by the user
  const userTrackStats = await prisma.userTrackProgress.findMany({
    where: {
      userId,
      status: 'DONE',
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

  // Query to get total number of tracks mounted by difficulty
  const totalMountedTracksByDifficulty = await prisma.track.groupBy({
    by: ['level'],
    where: {
      removed: false,
    },
    _count: {
      _all: true,
    },
  });
  const processStats = processTrackStats(userTrackStats as { track: Track }[], totalMountedTracksByDifficulty as { _count: { _all: number }, level: string }[]);

  return processStats;
};