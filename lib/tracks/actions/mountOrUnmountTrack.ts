'use server';
import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';

const prisma = new PrismaClient();

/**
 * Mounts or unmounts a track.
 * 
 * @param trackId - The track id.
 * @param removeTrack - True if the track should be unmounted, false if it should be mounted.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function mountOrUnmountTrack(
  trackId: number,
  removeTrack: boolean
) {
  const session = await auth();
  if (isOpener(session) === false) {
    throw new Error('You must be Admin or Opener in to perform this action. User id: ' + session?.user?.id);
  }
  try {
    await prisma.track.update({
      where: { id: trackId },
      data: {
        removed: removeTrack,
      },
    });
    return true;
  } catch (err) {
    console.error('Error updating the track', err);
    return false;
  }
}