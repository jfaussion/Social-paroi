'use server';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

/**
 * Adds a track to a contest using the ContestTrack join table.
 * 
 * @param contestId - The ID of the contest.
 * @param trackId - The ID of the track to add.
 * @returns A Promise that resolves to true if the track was added successfully, or false if an error occurs.
 */
export async function addTrackToContest(contestId: number, trackId: number): Promise<boolean> {
  try {
    await prisma.contestTrack.create({
      data: {
        contestId: contestId,
        trackId: trackId,
      },
    });
    return true;
  } catch (err) {
    console.error('Error adding track to contest', err);
    return false;
  }
} 