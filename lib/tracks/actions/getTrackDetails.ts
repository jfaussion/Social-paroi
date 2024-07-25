'use server';
import { PrismaClient } from '@prisma/client/edge';
import { mergeTrackWithProgress } from './mergeTrackWithProgress';

const prisma = new PrismaClient();

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
  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        trackProgress: {
          select: {
            status: true,
            dateCompleted: true,
          },
          where: { userId: userId },
        },
      },
    });

    if (track) {
      return mergeTrackWithProgress(track);
    }
    return null;
  } catch (err) {
    console.error('Error fetching track details', err);
    return null;
  }
}