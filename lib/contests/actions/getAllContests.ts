'use server'
import prisma from '@/prisma';
import { Contest } from "@/domain/Contest.schema"; // Adjust the import based on your schema
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('getAllContests');

/**
 * Retrieves all contests.
 * @returns A promise that resolves to an array of active contests ordered by date.
 */
export async function getAllContests(): Promise<Contest[]> {
  logger.start();
  try {
    const activeContests = await prisma.contest.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    logger.success({ contestCount: activeContests.length });
    return activeContests as Contest[];
  } catch (err) {
    logger.error(err);
    return [];
  }
}
