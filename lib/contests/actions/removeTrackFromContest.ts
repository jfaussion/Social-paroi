'use server';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

/**
 * Removes a track from a contest using the ContestTrack join table.
 * 
 * @param contestId - The ID of the contest.
 * @param trackId - The ID of the track to remove.
 * @returns A Promise that resolves to true if the track was removed successfully, or false if an error occurs.
 */
export async function removeTrackFromContest(contestId: number, trackId: number): Promise<boolean> {
  try {
    await prisma.contestTrack.deleteMany({
      where: {
        contestId: contestId,
        trackId: trackId,
      },
    });
    return true;
  } catch (err) {
    console.error('Error removing track from contest', err);
    return false;
  }
} 