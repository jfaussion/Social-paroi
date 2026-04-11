'use server';
import prisma from '@/prisma';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('removeContestUser');

/**
 * Removes a user from a contest using the ContestUser join table.
 * 
 * @param contestUserId - The ID of the ContestUser to remove.
 * @returns A Promise that resolves to true if the user was removed successfully, or false if an error occurs.
 */
export async function removeContestUser(contestUserId: number): Promise<boolean> {
  logger.start({ contestUserId });
  try {
    await prisma.contestUser.deleteMany({
      where: {
        id: contestUserId,
      },
    });
    logger.success({ contestUserId });
    return true;
  } catch (err) {
    logger.error(err, { contestUserId });
    return false;
  }
} 
