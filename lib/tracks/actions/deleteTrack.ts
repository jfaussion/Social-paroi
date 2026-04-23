'use server';
import prisma from '@/prisma';
import { Track } from '@/domain/Track.schema';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('deleteTrackAndImage');

export async function deleteTrackAndImage(track: Track) {
  const dbTrack = await prisma.track.findUnique({ where: { id: track.id }, select: { locationId: true } });
  if (!dbTrack?.locationId) {
    throw new Error('Track not found');
  }
  await checkRoleOrThrow({ locationId: dbTrack.locationId, actionName: 'delete track' });
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
