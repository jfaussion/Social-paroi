'use server';
import prisma from '@/prisma';
import { Contest } from '@/domain/Contest.schema';
import { ContestStatusType } from '@/domain/ContestStatus.enum';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('callChangeContestStatus');

export async function callChangeContestStatus(contest: Contest, newStatus: ContestStatusType, locationId: number) {
  await checkRoleOrThrow({ locationId, actionName: 'change contest status' });
  
  logger.start({ contestId: contest.id, newStatus });
  try {
    await prisma.contest.update({
      where: {
        id: contest.id
      },
      data: {
        status: newStatus
      }
    });

    logger.success({ contestId: contest.id, contestName: contest.name, newStatus });
  } catch (err) {
    logger.error(err, { contestId: contest.id, newStatus });
  }
}
