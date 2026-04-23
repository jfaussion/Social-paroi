'use server';
import prisma from '@/prisma';
import { auth } from '@/auth';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRole } from '@/domain/LocationRole.enum';
import { parseIntOrThrow } from '@/lib/utils/validation';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('postNewTrack');

export async function postNewTrack(
  trackId: number | undefined,
  track: FormData,
  locationId: number
) {
  const user = await auth();
  const isOpener = user?.user?.id ? await checkUserLocationRole(user.user.id, locationId, LocationRole.opener) : false;
  if (!isOpener) {
    const error = new Error('You must be Admin or Opener in to perform this action.');
    logger.error(error, { trackId, userId: user?.user?.id });
    throw error;
  }

  try {
    const name = track.get('name') as string;
    const zone = parseIntOrThrow(track.get('zone') as string, 'zone');
    const zoneId = parseIntOrThrow(track.get('zoneId') as string, 'zoneId');
    const holdColor = track.get('holdColor') as string;
    const points = parseIntOrThrow(track.get('points') as string, 'points');
    const imageUrl = track.get('imageUrl') as string;
    const removedFlag = track.get('removed') === 'true';
    const difficultyLevelIdStr = track.get('difficultyLevelId') as string | null;
    const difficultyLevelId = difficultyLevelIdStr ? parseIntOrThrow(difficultyLevelIdStr, 'difficultyLevelId') : undefined;
    const level = 'Unknown';

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
        zoneId,
        level,
        holdColor,
        points,
        imageUrl,
        removed: removedFlag,
        difficultyLevelId: difficultyLevelId || undefined,
      },
      create: {
        name,
        zone,
        zoneId,
        level,
        holdColor,
        points,
        date: new Date(),
        imageUrl,
        removed: false,
        locationId,
        difficultyLevelId: difficultyLevelId || undefined,
      },
    });
    logger.success({ trackId: newTrack.id, level: newTrack.level, zone: newTrack.zone });
    return newTrack;
  } catch (err) {
    logger.error(err, { trackId });
    return null;
  }
}
