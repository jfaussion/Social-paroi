'use server';

import { auth } from '@/auth';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRole } from '@/domain/LocationRole.enum';
import prisma from '@/prisma';
import { ContestActivity } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('removeActivity');

/**
 * Removes an activity
 * @param activity - The activity to remove
 * @returns true if successful, false otherwise
 */
export const removeActivity = async (
  activity: ContestActivity
): Promise<boolean> => {
  const user = await auth();
  const contest = await prisma.contest.findUnique({ where: { id: activity.contestId }, select: { locationId: true } });
  const isOpener = user?.user?.id && contest?.locationId
    ? await checkUserLocationRole(user.user.id, contest.locationId, LocationRole.opener)
    : false;
  if (!isOpener) {
    const error = new Error('You must be Admin or Opener to perform this action.');
    logger.error(error, { activityId: activity.id, userId: user?.user?.id });
    throw error;
  }

  try {
    logger.start({ activityId: activity.id, hasImage: Boolean(activity?.image) });
    if (activity?.image) {
      await deleteImageFromCloudinary(activity.image);
    }
    await prisma.contestActivity.delete({
      where: {
        id: activity.id,
      },
    });
    logger.success({ activityId: activity.id });
    return true;
  } catch (error) {
    logger.error(error, { activityId: activity.id });
    return false;
  }
};
