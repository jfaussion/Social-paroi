'use server'
import { Contest } from "@/domain/Contest.schema"; // Adjust the import based on your schema
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

/**
 * Retrieves all contests.
 * @returns A promise that resolves to an array of active contests ordered by date.
 */
export async function getAllContests(): Promise<Contest[]> {
  try {
    const activeContests = await prisma.contest.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    return activeContests;
  } catch (err) {
    console.error('Error fetching active contests', err);
    return [];
  }
}