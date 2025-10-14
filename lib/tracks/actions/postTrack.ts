'use server';
import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = createActionLogger('postNewTrack');

/**
 * Creates a new track or updates an existing one.
 * Assuming the image is uploaded and the URL is passed in the form data.
 * 
 * @param trackId - The track id.
 * @param track - The track data.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function postNewTrack(
  trackId: number | undefined,
  track: FormData
) {
  const user = await auth();
  if (isOpener(user) === false){
    const error = new Error('You must be Admin or Opener in to perform this action.');
    logger.error(error, { trackId, userId: user?.user?.id });
    throw error;
  }

  try {
    const name = track.get('name') as string;
    const zone = parseInt(track.get('zone') as string);
    const level = track.get('level') as string;
    const holdColor = track.get('holdColor') as string;
    const points = parseInt(track.get('points') as string);
    const imageUrl = track.get('imageUrl') as string;
    const removedFlag = track.get('removed') === 'true';

    logger.start({
      trackId: trackId ?? null,
      level,
      zone,
      hasImage: Boolean(imageUrl),
      removedFlag,
    });

    const newTrack = await prisma.track.upsert({
      where: {
        id: trackId ?? -1,
      },
      update: {
        name,
        zone,
        level,
        holdColor,
        points,
        imageUrl,
        removed: removedFlag,
      },
      create: {
        name,
        zone,
        level,
        holdColor,
        points,
        date: new Date(),
        imageUrl,
        removed: false,
        locationId: 1, // TODO: Remove this once we have a real location
      },
    });
    logger.success({ trackId: newTrack.id, level: newTrack.level, zone: newTrack.zone });
    return newTrack;
  } catch (err) {
    logger.error(err, { trackId });
    return null;
  }
}
