'use server';

import { PrismaClient } from '@prisma/client';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
const prisma = new PrismaClient();

/**
 * Updates the status of a track for a specific user in a contest
 * If the user is not an opener, they can only update their own progress
 */
export async function updateContestTrackStatus(
  contestId: number,
  contestUserId: number,
  trackId: number,
  status: TrackStatus
) {
  try {
    // Get the current user from the session
    const user = await auth();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }

    let finalContestUserId = contestUserId;

    // If not an opener, get the contestUserId for the current user
    if (!isOpener(user)) {
      const userContestParticipation = await prisma.contestUser.findFirst({
        where: {
          contestId: contestId,
          userId: user.user.id,
        },
      });

      if (!userContestParticipation) {
        console.error('User not participating in this contest');
        throw new Error('User not participating in this contest');
      }

      // Override the contestUserId with the user's own contestUserId
      finalContestUserId = userContestParticipation.id;
    } else {
      // Verify that the ContestUser exists before proceeding
      const contestUser = await prisma.contestUser.findUnique({
        where: {
          id: contestUserId,
        },
      });

      if (!contestUser) {
        throw new Error('Contest user not found');
      }
    }

    console.log('finalContestUserId', finalContestUserId);

    // Get the contestTrackId
    const contestTrack = await prisma.contestTrack.findFirst({
      where: {
        contestId: contestId,
        trackId: trackId,
      },
    });

    if (!contestTrack) {
      throw new Error('Contest track not found');
    }

    // Update or create the user's progress for this track
    const result = await prisma.contestUserTrack.upsert({
      where: {
        contestUserId_contestTrackId: {
          contestUserId: finalContestUserId,
          contestTrackId: contestTrack.id,
        },
      },
      update: {
        status: status,
        updatedAt: new Date(),
      },
      create: {
        contestUserId: finalContestUserId,
        contestTrackId: contestTrack.id,
        status: status,
      },
    });

    revalidatePath('/contests/[id]', 'page');
    return result;
  } catch (error) {
    console.error('Error updating contest track status:', error);
    return null;
  }
} 