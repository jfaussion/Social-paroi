'use server';

import { PrismaClient } from '@prisma/client';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

async function getFinalContestUserId(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  user: Session,
  contestId: number,
  contestUserId: number,
): Promise<number> {
  if (!isOpener(user)) {
    const userContestParticipation = await tx.contestUser.findFirst({
      where: {
        contestId,
        userId: user.user!.id,
      },
    });

    if (!userContestParticipation) {
      throw new Error('User not participating in this contest');
    }

    return userContestParticipation.id;
  } 
  
  const contestUser = await tx.contestUser.findUnique({
    where: { id: contestUserId },
  });

  if (!contestUser) {
    throw new Error('Contest user not found');
  }

  return contestUserId;
}

async function getContestTrack(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  contestId: number,
  trackId: number,
) {
  const contestTrack = await tx.contestTrack.findFirst({
    where: {
      contestId,
      trackId,
    },
  });

  if (!contestTrack) {
    throw new Error('Contest track not found');
  }

  return contestTrack;
}

async function updateContestUserTrack(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  contestUserId: number,
  contestTrackId: number,
  status: TrackStatus,
) {
  return tx.contestUserTrack.upsert({
    where: {
      contestUserId_contestTrackId: {
        contestUserId,
        contestTrackId,
      },
    },
    update: {
      status,
      updatedAt: new Date(),
    },
    create: {
      contestUserId,
      contestTrackId,
      status,
    },
  });
}

async function updateRegularTrackProgress(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  finalContestUserId: number,
  trackId: number,
  status: TrackStatus,
) {
  const contestUser = await tx.contestUser.findUnique({
    where: { id: finalContestUserId },
    select: { userId: true },
  });

  if (contestUser?.userId) {
    await tx.userTrackProgress.upsert({
      where: {
        user_track_unique_constraint: {
          trackId,
          userId: contestUser.userId,
        },
      },
      update: { status },
      create: {
        userId: contestUser.userId,
        trackId,
        status,
      },
    });
  }
}

export async function updateContestTrackStatus(
  contestId: number,
  contestUserId: number,
  trackId: number,
  status: TrackStatus,
) {
  try {
    const user = await auth();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }

    return await prisma.$transaction(async (tx) => {
      const finalContestUserId = await getFinalContestUserId(tx, user, contestId, contestUserId);
      const contestTrack = await getContestTrack(tx, contestId, trackId);
      
      const result = await updateContestUserTrack(tx, finalContestUserId, contestTrack.id, status);
      await updateRegularTrackProgress(tx, finalContestUserId, trackId, status);

      revalidatePath('/contests/[id]', 'page');
      return result;
    });
  } catch (error) {
    console.error('Error updating contest track status:', error);
    return null;
  }
} 