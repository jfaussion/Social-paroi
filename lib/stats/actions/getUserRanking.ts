'use server';
import prisma from '@/prisma';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('getUserRankings');

/**
 * Retrieves the user rankings.
 * @returns A Promise that resolves to an array of user rankings.
 */
export async function getUserRankings(locationId: number) {
  logger.start();
  try {
    const rankings = await prisma.user.findMany({
      where: {
        locationMemberships: {
          some: { locationId },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        UserTrackProgress: {
          where: {
            status: TrackStatus.DONE,
          },
          select: {
            track: {
              select: {
                points: true,
              },
              where: {
                removed: false,
                locationId,
              }
            },
          }
        },
      },
    });

    // Calculate the total score for each user
    const userScores = rankings.map(user => {
      const totalScore = user.UserTrackProgress.reduce((acc, progress) => acc + (progress.track?.points || 0), 0);
      return {
        id: user.id,
        name: user.name,
        image: user.image,
        score: totalScore,
      };
    });

    // Sort users by score in descending order
    userScores.sort((a, b) => b.score - a.score);

    logger.success({ rankingCount: userScores.length });
    return userScores;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
