'use server';
import prisma from '@/prisma';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('mountOrUnmountTrack');

/**
 * Mounts or unmounts tracks.
 * 
 * @param trackIds - The list of track ids.
 * @param removeTrack - True if the tracks should be unmounted, false if they should be mounted.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function mountOrUnmountTrack(
  trackIds: number[],
  removeTrack: boolean
) {
  const session = await auth();
  if (isOpener(session) === false) {
    const error = new Error('You must be Admin or Opener in to perform this action.');
    logger.error(error, { trackIds, removeTrack, userId: session?.user?.id });
    throw error;
  }
  logger.start({ trackIdsCount: trackIds.length, removeTrack });
  try {
    await prisma.track.updateMany({
      where: { id: { in: trackIds } },
      data: {
        removed: removeTrack,
      },
    });
    logger.success({ trackIdsCount: trackIds.length, removeTrack });
    return true;
  } catch (err) {
    logger.error(err, { trackIdsCount: trackIds.length, removeTrack });
    return false;
  }
}
