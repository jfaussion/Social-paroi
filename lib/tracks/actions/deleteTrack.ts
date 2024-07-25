'use server';
import { Track } from '@/domain/Track.schema';
import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';

const prisma = new PrismaClient();

/**
 * Deletes a track and its image from the database and cloudinary.
 * 
 * @param track - The track to be deleted.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function deleteTrackAndImage(track: Track) {
  const session = await auth();
  if (isOpener(session) === false) {
    throw new Error('You must be Admin or Opener in to perform this action. User id: ' + session?.user?.id);
  }
  try {
    if (track?.imageUrl) {
      await deleteImageFromCloudinary(track.imageUrl);
    }
    await prisma.track.delete({
      where: { id: track.id },
    });
    console.log('Track deleted, id:', track.id, 'name:', track.name);
  } catch (err) {
    console.error('Error deleting the track', err);
  }
}