'use server';
import prisma from '@/prisma';
import { parseIntOrThrow } from '@/lib/utils/validation';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('postNewTrack');

export async function postNewTrack(
  trackId: number | undefined,
  track: FormData,
  locationId: number
) {
  await checkRoleOrThrow({ locationId, actionName: 'create or update track' });

  try {
    const name = track.get('name') as string;
    const zoneId = parseIntOrThrow(track.get('zoneId') as string, 'zoneId');
    const holdColorIdStr = track.get('holdColorId') as string | null;
    const holdColorId = holdColorIdStr ? parseIntOrThrow(holdColorIdStr, 'holdColorId') : undefined;
    const points = parseIntOrThrow(track.get('points') as string, 'points');
    const imageUrl = track.get('imageUrl') as string;
    const removedFlag = track.get('removed') === 'true';
    const difficultyLevelIdStr = track.get('difficultyLevelId') as string | null;
    const difficultyLevelId = difficultyLevelIdStr ? parseIntOrThrow(difficultyLevelIdStr, 'difficultyLevelId') : undefined;

    logger.start({
      trackId: trackId ?? null,
      hasImage: Boolean(imageUrl),
      removedFlag,
    });

    const newTrack = await prisma.track.upsert({
      where: {
        id: trackId ?? -1,
      },
      update: {
        name,
        zoneId,
        holdColorId: holdColorId ?? null,
        points,
        imageUrl,
        removed: removedFlag,
        difficultyLevelId: difficultyLevelId || undefined,
      },
      create: {
        name,
        zoneId,
        holdColorId: holdColorId ?? null,
        points,
        date: new Date(),
        imageUrl,
        removed: false,
        locationId,
        difficultyLevelId: difficultyLevelId || undefined,
      },
    });
    logger.success({ trackId: newTrack.id });
    return newTrack;
  } catch (err) {
    logger.error(err, { trackId });
    return null;
  }
}
