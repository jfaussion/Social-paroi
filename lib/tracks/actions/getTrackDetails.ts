'use server';
import prisma from '@/prisma';
import { mergeTrackWithProgress } from './mergeTrackWithProgress';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { createActionLogger } from '@/utils/logger';
import { checkUserLocationMembership } from '@/lib/locations/actions/checkUserLocationMembership';
const logger = createActionLogger('getTrackDetails');

export async function getTrackDetails(
  trackId: number,
  userId: string,
  locationId?: number
) {
  logger.start({ trackId, userId, locationId });
  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        difficultyLevel: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        zoneRef: {
          select: {
            id: true,
            name: true,
            miniMapUrl: true,
          },
        },
        trackProgress: {
          select: {
            status: true,
            dateCompleted: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          where: { 
            status: TrackStatus.DONE,
          },
        },
      },
    });

    if (!track) {
      logger.info('trackNotFound', { trackId, userId });
      return null;
    }

    if (!track.locationId) {
      logger.error(new Error('Track has no location'), { trackId, userId });
      return null;
    }

    const isMember = await checkUserLocationMembership(userId, track.locationId);
    if (!isMember) {
      logger.error(new Error('Unauthorized access attempt'), { trackId, userId, locationId: track.locationId });
      return null;
    }

    const mergedTrack = mergeTrackWithProgress(track, userId);
    logger.success({
      trackId,
      userId,
      progressItems: track.trackProgress.length,
    });
    return mergedTrack;
  } catch (err) {
    logger.error(err, { trackId, userId });
    return null;
  }
}