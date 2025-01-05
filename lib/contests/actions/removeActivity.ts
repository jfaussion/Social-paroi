'use server';

import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
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