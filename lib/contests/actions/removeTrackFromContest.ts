'use server';
import { PrismaClient } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = createActionLogger('removeTrackFromContest');

/**
 * Removes a track from a contest using the ContestTrack join table.
 * 
 * @param contestId - The ID of the contest.
 * @param trackId - The ID of the track to remove.
 * @returns A Promise that resolves to true if the track was removed successfully, or false if an error occurs.
 */
export async function removeTrackFromContest(contestId: number, trackId: number): Promise<boolean> {
  logger.start({ contestId, trackId });
  try {
    await prisma.contestTrack.deleteMany({
      where: {
        contestId: contestId,
        trackId: trackId,
      },
    });
    logger.success({ contestId, trackId });
    return true;
  } catch (err) {
    logger.error(err, { contestId, trackId });
    return false;
  }
} 
