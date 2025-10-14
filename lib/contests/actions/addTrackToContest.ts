'use server';
import { PrismaClient } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = createActionLogger('addTrackToContest');

/**
 * Adds a track to a contest using the ContestTrack join table.
 * 
 * @param contestId - The ID of the contest.
 * @param trackId - The ID of the track to add.
 * @returns A Promise that resolves to true if the track was added successfully, or false if an error occurs.
 */
export async function addTrackToContest(contestId: number, trackId: number): Promise<boolean> {
  logger.start({ contestId, trackId });
  try {
    await prisma.contestTrack.create({
      data: {
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
