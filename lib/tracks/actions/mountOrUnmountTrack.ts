'use server';
import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';

const prisma = new PrismaClient();

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
    throw new Error('You must be Admin or Opener in to perform this action. User id: ' + session?.user?.id);
  }
  console.log(`mountOrUnmountTrack - Remove Track: ${removeTrack}, Track IDs: ${trackIds}`);
  try {
    await prisma.track.updateMany({
      where: { id: { in: trackIds } },
      data: {
        removed: removeTrack,
      },
    });
    return true;
  } catch (err) {
    console.error('Error updating the tracks', err);
    return false;
  }
}