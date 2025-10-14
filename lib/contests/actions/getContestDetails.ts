'use server';
import { ContestSchema } from '@/domain/Contest.schema';
import { PrismaClient } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = createActionLogger('getContestDetails');

/**
 * Retrieves the details of a contest.
 * @param contestId - The ID of the contest.
 * @param userId - The ID of the user. (used to fetch the user progress on this contest)
 * @returns A Promise that resolves to the contest details with progress, or null if the contest is not found or an error occurs.
 */
export async function getContestDetails(
  contestId: number,
  userId: string
) {
  logger.start({ contestId, userId });
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        contestTracks: {
          include: {
            track: true,
            userResults: {
              where: {
                contestUser: {
                  userId: userId
                }
              }
            }
          },
        },
        contestUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                emailVerified: true,
              },
            },
          },
        },
        contestActivities: {
          include: {
            userResults: {
              where: {
                contestUser: {
                  userId: userId
                }
              }
            }
          }
        },
      },
    });

    if (contest) {
      // Validate and return the contest details using the schema
      const parsedContest = ContestSchema.parse({
        ...contest,
        activities: contest.contestActivities.map(activity => ({
          ...activity,
          userScore: activity.userResults[0]?.score || 0
        })),
        users: contest.contestUsers,
        tracks: contest.contestTracks.map(ct => ({
          ...ct.track,
          contestProgress: ct.userResults[0] || null
        })),
      });
      logger.success({
        contestId,
        userId,
        activityCount: contest.contestActivities.length,
        trackCount: contest.contestTracks.length,
        userCount: contest.contestUsers.length
      });
      return parsedContest;
    }
    logger.info('contestNotFound', { contestId, userId });
    return null;
  } catch (err) {
    logger.error(err, { contestId, userId });
    return null;
  }
}
