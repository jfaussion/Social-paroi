'use server';

import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

/**
 * Updates the score of an activity in a contest
 * @param contestId - The ID of the contest
 * @param activityId - The ID of the activity
 * @param score - The new score
 * @returns true if successful, false otherwise
 */
export const updateActivityScore = async (
  contestId: number,
  activityId: number,
  score: number
): Promise<boolean> => {
  try {
    console.log('Updating activity score:', contestId, activityId, score);
    // TODO: update activity score in database using the future activityUser table
    
    // await prisma.contestActivity.update({
    //   where: {
    //     id: activityId,
    //     contestId: contestId,
    //   },
    //   data: {
    //     score: score,
    //   },
    // });
    return true;
  } catch (error) {
    console.error('Error updating activity score:', error);
    return false;
  }
}; 