'use server';

import { auth } from '@/auth';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { isOpener } from '@/utils/session.utils';
import { ContestActivity, PrismaClient } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
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
  if (isOpener(user) === false) {
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
