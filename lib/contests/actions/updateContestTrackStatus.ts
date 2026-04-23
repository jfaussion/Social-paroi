'use server';

import prisma from '@/prisma';
import type { PrismaClient } from '@prisma/client';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRole } from '@/domain/LocationRole.enum';
import { ContestStatusEnum } from '@/domain/ContestStatus.enum';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('updateContestTrackStatus');

async function getFinalContestUserId(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  isOpener: boolean,
  userId: string,
  contestId: number,
  contestUserId: number,
): Promise<number> {
  logger.info('resolveContestUserId', {
    contestId,
    requestedContestUserId: contestUserId,
    isOpener: isOpener,
    userId,
  });

  if (isOpener) {
    logger.info('openerProvidedContestUser', { contestId, contestUserId });
    // Check if user is participating in the contest
    const contestUser = await tx.contestUser.findUnique({
      where: { id: contestUserId },
    });

    if (!contestUser) {
      const error = new Error('Contest user not found');
      logger.error(error, { contestId, contestUserId });
      throw error;
    }

    logger.info('contestUserValidated', { contestId, contestUserId });
    return contestUserId;

  } else {
    logger.info('nonOpenerContestUserResolution', { contestId, userId });
    // Check contest status
    const contest = await tx.contest.findFirst({
      where: {
        id: contestId
      }
    });

    if (contest?.status != ContestStatusEnum.Enum.InProgress) {
      const error = new Error('User cannot update track if contest not in progress');
      logger.error(error, { contestId, contestStatus: contest?.status });
      throw error;
    }
    // Check if user is participating in the contest
    const userContestParticipation = await tx.contestUser.findFirst({
      where: {
        contestId,
        userId,
      },
    });
    if (!userContestParticipation) {
      const error = new Error('User not participating in this contest');
      logger.error(error, { contestId, userId });
      throw error;
    }
    logger.info('participantContestUserResolved', { contestId, contestUserId: userContestParticipation.id });
    return userContestParticipation.id;
  }
}

async function getContestTrack(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  contestId: number,
  trackId: number,
) {
  logger.info('fetchContestTrack', { contestId, trackId });
  const contestTrack = await tx.contestTrack.findFirst({
    where: {
      contestId,
      trackId,
    },
  });

  if (!contestTrack) {
    const error = new Error('Contest track not found');
    logger.error(error, { contestId, trackId });
    throw error;
  }

  logger.info('contestTrackResolved', { contestId, trackId, contestTrackId: contestTrack.id });
  return contestTrack;
}

async function updateContestUserTrack(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  contestUserId: number,
  contestTrackId: number,
  status: TrackStatus,
) {
  logger.info('updateContestUserTrack', { contestUserId, contestTrackId, status });
  const result = await tx.contestUserTrack.upsert({
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
  logger.info('contestUserTrackUpserted', {
    contestUserId,
    contestTrackId,
    status: result.status,
    contestUserTrackId: result.id,
  });
  return result;
}

async function updateRegularTrackProgress(
  tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  finalContestUserId: number,
  trackId: number,
  status: TrackStatus,
) {
  logger.info('updateRegularTrackProgress', { finalContestUserId, trackId, status });
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
    logger.info('userTrackProgressUpserted', {
      userId: contestUser.userId,
      trackId,
      status,
    });
  } else {
    logger.info('userTrackProgressSkipped', {
      finalContestUserId,
      trackId,
    });
  }
}

export async function updateContestTrackStatus(
  contestId: number,
  contestUserId: number,
  trackId: number,
  status: TrackStatus,
) {
  logger.start({ contestId, contestUserId, trackId, status });
  try {
    const user = await auth();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }
    const userId = user.user.id;

    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    const isOpener = contest?.locationId
      ? await checkUserLocationRole(userId, contest.locationId, LocationRole.opener)
      : false;

    return await prisma.$transaction(async (tx) => {
      const finalContestUserId = await getFinalContestUserId(tx, isOpener, userId, contestId, contestUserId);
      const contestTrack = await getContestTrack(tx, contestId, trackId);

      const result = await updateContestUserTrack(tx, finalContestUserId, contestTrack.id, status);
      await updateRegularTrackProgress(tx, finalContestUserId, trackId, status);

      revalidatePath('/contests/[id]', 'page');
      logger.success({
        contestId,
        contestUserId: finalContestUserId,
        trackId,
        status,
        contestUserTrackId: result.id,
      });
      return result;
    });
  } catch (error) {
    logger.error(error, { contestId, contestUserId, trackId, status });
    return null;
  }
}
