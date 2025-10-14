'use server';
import { PrismaClient } from '@prisma/client/edge';
import { GenderType } from '@/domain/ContestUser.schema';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = createActionLogger('addContestUser');

/**
 * Adds a user to a contest using the ContestUser join table.
 * 
 * @param contestId - The ID of the contest.
 * @param gender - The gender of the user.
 * @param userId - The ID of the user to add.
 * @param name - The name of the user.
 * @returns A Promise that resolves to the ID of the created ContestUser, or null if an error occurs.
 */
export async function addContestUser(
  contestId: number,
  gender: GenderType,
  userId?: string,
  name?: string
): Promise<number | null> {
  logger.start({ contestId, gender, userId, name });
  try {
    const contestUser = await prisma.contestUser.create({
      data: {
        contestId: contestId,
        userId: userId ?? null,
        gender: gender,
        name: name ?? null,
        isTemp: !!name,
      },
    });
    logger.success({ contestUserId: contestUser.id, contestId, userId });
    return contestUser.id;
  } catch (err) {
    logger.error(err, { contestId, gender, userId, name });
    return null;
  }
} 
