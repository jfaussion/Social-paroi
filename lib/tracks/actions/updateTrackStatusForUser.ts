'use server';
import { PrismaClient } from '@prisma/client/edge';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';
import { isOpener } from '@/utils/session.utils';
import { auth } from '@/auth';

const prisma = new PrismaClient()

async function updateRegularTrackStatus(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  trackId: number,
  userId: string,
  status: TrackStatus,
) {
  return tx.userTrackProgress.upsert({
    where: {
      user_track_unique_constraint: {
        trackId,
        userId,
      },
    },
    update: { status },
    create: {
      userId,
      trackId,
      status,
    },
  });
}

async function findContestTracksWhereUserParticipating(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  trackId: number,
  userId: string,
) {
  return tx.contestTrack.findMany({
    where: {
      trackId,
      contest: {
        contestUsers: {
          some: { userId },
        },
      },
    },
    include: {
      contest: {
        include: {
          contestUsers: {
            where: { userId },
          },
        },
      },
    },
  });
}

async function updateContestTrackStatus(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  contestTrack: any,
  contestUser: any,
  status: TrackStatus,
) {
  return tx.contestUserTrack.upsert({
    where: {
      contestUserId_contestTrackId: {
        contestUserId: contestUser.id,
        contestTrackId: contestTrack.id,
      },
    },
    update: {
      status,
      updatedAt: new Date(),
    },
    create: {
      contestUserId: contestUser.id,
      contestTrackId: contestTrack.id,
      status,
    },
  });
}

export async function updateTrackStatusForUser(
  trackId: number,
  userId: string,
  newStatus: TrackStatus,
): Promise<boolean> {
  try {
    const user = await auth();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    return await prisma.$transaction(async (tx) => {
      // Update regular track status
      await updateRegularTrackStatus(tx, trackId, userId, newStatus);

      // Find and update related contest tracks
      const activeContestTracks = await findContestTracksWhereUserParticipating(tx, trackId, userId);
      
      for (const contestTrack of activeContestTracks) {
        const contestUser = contestTrack.contest.contestUsers[0];
        const isSelfContester = contestUser?.userId === user.user?.id;
        const canUpdateContestTrack = isOpener(user) || (isSelfContester && contestTrack.contest.status === ContestStatusEnum.Enum.InProgress)
        
        if (contestUser && canUpdateContestTrack) {
          await updateContestTrackStatus(tx, contestTrack, contestUser, newStatus);
        }
      }

      return true;
    });
  } catch (err) {
    console.error('Error updating the track for user', err);
    return false;
  }
}