'use server';
import { PrismaClient } from '@prisma/client/edge';
import { mergeTrackWithProgress } from './mergeTrackWithProgress';
import { TrackStatus } from '@/domain/TrackStatus.enum';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = createActionLogger('getTrackDetails');

/**
 * Retrieves the details of a track.
 * @param trackId - The ID of the track.
 * @param userId - The ID of the user. (used to fetch the user progress on this track)
 * @returns A Promise that resolves to the track details with progress, or null if the track is not found or an error occurs.
 */
export async function getTrackDetails(
  trackId: number,
  userId: string
) {
  logger.start({ trackId, userId });
  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
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

    if (track) {
      const mergedTrack = mergeTrackWithProgress(track, userId);
      logger.success({
        trackId,
        userId,
        progressItems: track.trackProgress.length,
      });
      return mergedTrack;
    }
    logger.info('trackNotFound', { trackId, userId });
    return null;
  } catch (err) {
    logger.error(err, { trackId, userId });
    return null;
  }
}
