'use server';
import { ContestSchema } from '@/domain/Contest.schema';
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
      include: {
        contestTracks: {
          include: {
            track: true, // Fetch the linked Track details
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
            user: { // Fetch the linked User details
              select: {
                id: true,
                name: true,
                image: true,
                emailVerified: true,
              },
            },
          },
        },
        contestActivities: true,
      },
    });

    if (contest) {
      // Validate and return the contest details using the schema
      return ContestSchema.parse({
        ...contest,
        activities: contest.contestActivities,
        users: contest.contestUsers,
        tracks: contest.contestTracks.map(ct => ({
          ...ct.track,
          contestProgress: ct.userResults[0] || null
        })),
      });
    }
    return null;
  } catch (err) {
    console.error('Error fetching contest details', err);
    return null;
  }
}