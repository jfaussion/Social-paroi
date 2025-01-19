'use server';

import { auth } from '@/auth';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { isOpener } from '@/utils/session.utils';
import { ContestActivity, PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

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
    throw new Error('You must be Admin or Opener to perform this action. User: \n' + user);
  }
  
  try {
    if (activity?.image) {
      await deleteImageFromCloudinary(activity.image);
    }
    await prisma.contestActivity.delete({
      where: {
        id: activity.id,
      },
    });
    return true;
  } catch (error) {
    console.error('Error removing activity from contest:', error);
    return false;
  }
}; 