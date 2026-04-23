'use server';

import prisma from '@/prisma';
import { ContestActivity } from "@/domain/ContestActivity.schema";
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
import { parseIntOrThrow } from '@/lib/utils/validation';
const logger = createActionLogger('postActivityToContest');

export const postActivityToContest = async (
  contestId: number,
  formData: FormData
): Promise<ContestActivity | null> => {
  const contest = await prisma.contest.findUnique({ where: { id: contestId }, select: { locationId: true } });
  if (!contest?.locationId) {
    throw new Error('Contest not found');
  }
  await checkRoleOrThrow({ locationId: contest.locationId, actionName: 'add activity to contest' });

  try {
    const activityId = parseIntOrThrow(formData.get('id') as string, 'activityId');
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
