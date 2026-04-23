'use server';

import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import prisma from '@/prisma';
import { ContestActivity } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('removeActivity');

export const removeActivity = async (
  activity: ContestActivity
): Promise<boolean> => {
  const contest = await prisma.contest.findUnique({ where: { id: activity.contestId }, select: { locationId: true } });
  if (!contest?.locationId) {
    throw new Error('Contest not found');
  }
  await checkRoleOrThrow({ locationId: contest.locationId, actionName: 'remove activity' });

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
