'use server';
import prisma from '@/prisma';
import { Contest } from '@/domain/Contest.schema';
import { deleteImageFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('callDeleteContest');

export async function callDeleteContest(contest: Contest, locationId: number) {
  await checkRoleOrThrow({ locationId, actionName: 'delete contest' });
  
  logger.start({ contestId: contest.id, hasCoverImage: Boolean(contest?.coverImage) });
  try {
    if (contest?.coverImage) {
      await deleteImageFromCloudinary(contest.coverImage);
    }
    await prisma.contest.delete({
      where: { id: contest.id },
    });
    logger.success({ contestId: contest.id, contestName: contest.name, hadCoverImage: Boolean(contest?.coverImage) });
  } catch (err) {
    logger.error(err, { contestId: contest.id });
  }
}
