'use server';
import prisma from '@/prisma';
import type { PrismaClient } from '@prisma/client';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';
import { isOpener } from '@/utils/session.utils';
import { auth } from '@/auth';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('updateTrackStatusForUser');

async function updateRegularTrackStatus(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  trackId: number,
  userId: string,
  status: TrackStatus,
) {
  logger.info('updateRegularTrackStatus', { trackId, userId, status });
  const result = await tx.userTrackProgress.upsert({
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
  logger.info('regularTrackStatusUpserted', { trackId, userId, status: result.status });
  return result;
}

async function findContestTracksWhereUserParticipating(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  trackId: number,
  userId: string,
) {
  logger.info('findContestTracksWhereUserParticipating', { trackId, userId });
  const contestTracks = await tx.contestTrack.findMany({
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
  logger.info('contestTracksFetched', { trackId, userId, contestTrackCount: contestTracks.length });
  return contestTracks;
}

async function updateContestTrackStatus(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  contestTrack: any,
  contestUser: any,
  status: TrackStatus,
) {
  logger.info('updateContestTrackStatus', {
    contestTrackId: contestTrack.id,
    contestUserId: contestUser.id,
    status,
  });
  const result = await tx.contestUserTrack.upsert({
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
  logger.info('contestUserTrackStatusUpserted', {
    contestTrackId: contestTrack.id,
    contestUserId: contestUser.id,
    status: result.status,
  });
  return result;
}

export async function updateTrackStatusForUser(
  trackId: number,
  userId: string,
  newStatus: TrackStatus,
): Promise<boolean> {
  logger.start({ trackId, userId, newStatus });
  try {
    const user = await auth();
    if (!user?.user?.id) {
      const error = new Error('User not authenticated');
      logger.error(error, { trackId, userId });
      throw error;
    }
    
    return await prisma.$transaction(async (tx) => {
      // Update regular track status
      await updateRegularTrackStatus(tx, trackId, userId, newStatus);
      logger.info('regularTrackUpdateCompleted', { trackId, userId, newStatus });

      // Find and update related contest tracks
      const activeContestTracks = await findContestTracksWhereUserParticipating(tx, trackId, userId);
      logger.info('contestTracksToUpdate', {
        trackId,
        userId,
        newStatus,
        contestTrackCount: activeContestTracks.length,
      });
      let updatedContestTracks = 0;
      
      for (const contestTrack of activeContestTracks) {
        const contestUser = contestTrack.contest.contestUsers[0];
        const isSelfContester = contestUser?.userId === user.user?.id;
        const canUpdateContestTrack = isOpener(user) || (isSelfContester && contestTrack.contest.status === ContestStatusEnum.Enum.InProgress)
        
        if (contestUser && canUpdateContestTrack) {
          await updateContestTrackStatus(tx, contestTrack, contestUser, newStatus);
          updatedContestTracks += 1;
        } else {
          logger.info('contestTrackUpdateSkipped', {
            contestTrackId: contestTrack.id,
            contestId: contestTrack.contestId,
            contestStatus: contestTrack.contest.status,
            contestUserId: contestUser?.id,
            isSelfContester,
            canUpdateContestTrack,
          });
        }
      }

      logger.success({
        trackId,
        userId,
        newStatus,
        updatedContestTracks,
      });
      return true;
    });
  } catch (err) {
    logger.error(err, { trackId, userId, newStatus });
    return false;
  }
}
