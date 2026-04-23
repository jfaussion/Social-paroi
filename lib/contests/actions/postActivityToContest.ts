'use server';

import prisma from '@/prisma';
import { ContestActivity } from "@/domain/ContestActivity.schema";
import { auth } from "@/auth";
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRole } from '@/domain/LocationRole.enum';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('postActivityToContest');

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
  const contest = await prisma.contest.findUnique({ where: { id: contestId }, select: { locationId: true } });
  const isOpener = user?.user?.id && contest?.locationId
    ? await checkUserLocationRole(user.user.id, contest.locationId, LocationRole.opener)
    : false;
  if (!isOpener) {
    const error = new Error('You must be Admin or Opener to perform this action.');
    logger.error(error, { contestId, userId: user?.user?.id });
    throw error;
  }

  try {
    const activityId = parseInt(formData.get('id') as string) || -1;
    logger.start({
      contestId,
      activityId,
      hasImage: Boolean(formData.get('imageFileUrl')),
    });

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

    logger.success({
      contestId,
      activityId: newActivity.id,
      hasImage: Boolean(newActivity.image),
    });
    return newActivity as ContestActivity;
  } catch (error) {
    logger.error(error, {
      contestId,
      formActivityId: formData.get('id'),
    });
    return null;
  }
};
