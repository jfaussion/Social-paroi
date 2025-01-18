'use server';

import { ContestActivity } from "@/domain/ContestActivity.schema";
import { PrismaClient } from '@prisma/client/edge';
import { auth } from "@/auth";
import { isOpener } from "@/utils/session.utils";

const prisma = new PrismaClient();

/**
 * Adds or updates an activity to a contest
 * @param contestId - The ID of the contest
 * @param formData - The form data containing activity information
 * @returns The created or updated activity if successful, null otherwise
 */
export const postActivityToContest = async (
  contestId: number,
  formData: FormData
): Promise<ContestActivity | null> => {
  const user = await auth();
  if (!isOpener(user)) {
    throw new Error('You must be Admin or Opener to perform this action.');
  }

  try {
    const activityId = parseInt(formData.get('id') as string) || -1;

    const newActivity = await prisma.contestActivity.upsert({
      where: { 
        id: activityId, // Use -1 for new activities
      },
      update: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        image: formData.get('imageFileUrl') as string,
      },
      create: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        image: formData.get('imageFileUrl') as string,
        contestId,
      },
    });
    
    return newActivity as ContestActivity;
  } catch (error) {
    console.error('Error adding/updating activity:', error);
    return null;
  }
}; 