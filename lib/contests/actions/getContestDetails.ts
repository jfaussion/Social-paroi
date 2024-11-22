'use server';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

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
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (contest) {
      return contest;
    }
    return null;
  } catch (err) {
    console.error('Error fetching contest details', err);
    return null;
  }
}