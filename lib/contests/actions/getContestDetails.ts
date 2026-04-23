'use server';
import prisma from '@/prisma';
import { ContestSchema } from '@/domain/Contest.schema';
import { createActionLogger } from '@/utils/logger';
import { checkUserLocationMembership } from '@/lib/locations/actions/checkUserLocationMembership';
const logger = createActionLogger('getContestDetails');

export async function getContestDetails(
  contestId: number,
  userId: string,
  locationId?: number
) {
  logger.start({ contestId, userId, locationId });
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        contestTracks: {
          include: {
            track: {
              include: {
                zoneRef: true,
                difficultyLevel: true,
              }
            },
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

    if (!contest) {
      logger.info('contestNotFound', { contestId, userId });
      return null;
    }

    if (!contest.locationId) {
      logger.error(new Error('Contest has no location'), { contestId, userId });
      return null;
    }

    const isMember = await checkUserLocationMembership(userId, contest.locationId);
    if (!isMember) {
      logger.error(new Error('Unauthorized access attempt'), { contestId, userId, locationId: contest.locationId });
      return null;
    }

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
      locationId: parsedContest.locationId,
      userId,
      activityCount: contest.contestActivities.length,
      trackCount: contest.contestTracks.length,
      userCount: contest.contestUsers.length
    });
    return parsedContest;
  } catch (err) {
    logger.error(err, { contestId, userId });
    return null;
  }
}