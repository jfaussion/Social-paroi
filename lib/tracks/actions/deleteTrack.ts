'use server';
import prisma from '@/prisma';
import { Track } from '@/domain/Track.schema';
import { auth } from '@/auth';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRole } from '@/domain/LocationRole.enum';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('deleteTrackAndImage');

/**
 * Deletes a track and its image from the database and cloudinary.
 *
 * @param track - The track to be deleted.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function deleteTrackAndImage(track: Track) {
  const session = await auth();
  const dbTrack = await prisma.track.findUnique({ where: { id: track.id }, select: { locationId: true } });
  const isOpener = session?.user?.id && dbTrack?.locationId
    ? await checkUserLocationRole(session.user.id, dbTrack.locationId, LocationRole.opener)
    : false;
  if (!isOpener) {
    const error = new Error('You must be Admin or Opener in to perform this action.');
    logger.error(error, { trackId: track.id, userId: session?.user?.id });
    throw error;
  }
  try {
    logger.start({ trackId: track.id, hasImage: Boolean(track?.imageUrl) });
    if (track?.imageUrl) {
      await deleteImageFromCloudinary(track.imageUrl);
    }
    await prisma.track.delete({
      where: { id: track.id },
    });
    logger.success({ trackId: track.id, trackName: track.name });
  } catch (err) {
    logger.error(err, { trackId: track.id });
  }
}
