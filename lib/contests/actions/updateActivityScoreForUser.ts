'use server';

import prisma from '@/prisma';
import type { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRole } from '@/domain/LocationRole.enum';
import { revalidatePath } from 'next/cache';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('updateActivityScoreForUser');

async function getFinalContestUserId(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  isOpener: boolean,
  userId: string,
  contestId: number,
  contestUserId: number,
): Promise<number> {
  logger.info('resolveContestUserId', {
    contestId,
    requestedContestUserId: contestUserId,
    isOpener: isOpener,
    userId,
  });

  if (!isOpener) {
    logger.info('usingParticipantContestUser', {
      contestId,
      userId,
    });
    const userContestParticipation = await tx.contestUser.findFirst({
      where: {
        AND: [
          { contestId },
          { userId }
        ]
      },
    });

    if (!userContestParticipation) {
      const error = new Error('User not participating in this contest');
      logger.error(error, { contestId, userId });
      throw error;
    }

    logger.info('participantContestUserResolved', {
      contestId,
      contestUserId: userContestParticipation.id,
    });
    return userContestParticipation.id;
  }

  // For openers, verify the provided contestUserId exists and belongs to the contest
  const contestUser = await tx.contestUser.findFirst({
    where: {
      AND: [
        { id: contestUserId },
        { contestId }
      ]
    },
  });

  if (!contestUser) {
    const error = new Error('Contest user not found');
    logger.error(error, { contestId, contestUserId });
    throw error;
  }

  logger.info('contestUserValidated', { contestId, contestUserId });
  return contestUserId;
}

/**
 * Updates the score of an activity in a contest
 * @param contestId - The ID of the contest
 * @param activityId - The ID of the activity
 * @param score - The new score
 * @param contestUserId - The ID of the contest user
 * @returns true if successful, false otherwise
 */
export const updateActivityScoreForUser = async (
  contestId: number,
  activityId: number,
  score: number,
  contestUserId: number
): Promise<boolean> => {
  logger.start({ contestId, activityId, score, contestUserId });
  try {
    const userSession = await auth();
    if (!userSession?.user?.id) {
      throw new Error('User not authenticated');
    }

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      throw new Error('Contest not found');
    }

    const isOpenerRole = contest.locationId
      ? await checkUserLocationRole(userSession.user.id, contest.locationId, LocationRole.opener)
      : false;

    if (!isOpenerRole && contest.status !== ContestStatusEnum.Enum.InProgress) {
      throw new Error('Contest is not in progress and user not an opener');
    }

    return await prisma.$transaction(async (tx) => {
      const finalContestUserId = await getFinalContestUserId(tx, isOpenerRole, userSession.user!.id, contestId, contestUserId);

      // Verify the activity exists and belongs to the contest
      const activity = await tx.contestActivity.findFirst({
        where: {
          id: activityId,
          contestId: contestId,
        },
      });

      if (!activity) {
        throw new Error('Activity not found or does not belong to this contest');
      }

      // Update or create the activity score
      await tx.contestUserActivity.upsert({
        where: {
          contestUserId_contestActivityId: {
            contestUserId: finalContestUserId,
            contestActivityId: activityId,
          },
        },
        update: {
          score: score,
          updatedAt: new Date(),
        },
        create: {
          contestUserId: finalContestUserId,
          contestActivityId: activityId,
          score: score,
        },
      });

      revalidatePath('/contests/[id]', 'page');
      logger.success({
        contestId,
        activityId,
        contestUserId: finalContestUserId,
        score,
      });
      return true;
    });

  } catch (error) {
    logger.error(error, { contestId, activityId, score, contestUserId });
    return false;
  }
};
