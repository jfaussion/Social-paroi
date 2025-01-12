'use server';

import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { Session } from 'next-auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

async function getFinalContestUserId(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  user: Session,
  contestId: number,
  contestUserId: number,
): Promise<number> {
  if (!isOpener(user)) {
    console.log('not', user);
    const userContestParticipation = await tx.contestUser.findFirst({
      where: {
        AND: [
          { contestId },
          { userId: user.user!.id }
        ]
      },
    });

    if (!userContestParticipation) {
      throw new Error('User not participating in this contest');
    }

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
  console.log('contestUserId', contestUserId);
  console.log('contestUser', contestUser);

  if (!contestUser) {
    throw new Error('Contest user not found');
  }

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
  try {
    const userSession = await auth();
    if (!userSession?.user?.id) {
      throw new Error('User not authenticated');
    }

    return await prisma.$transaction(async (tx) => {
      const finalContestUserId = await getFinalContestUserId(tx, userSession, contestId, contestUserId);

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
      return true;
    });

  } catch (error) {
    console.error('Error updating activity score:', error);
    return false;
  }
}; 