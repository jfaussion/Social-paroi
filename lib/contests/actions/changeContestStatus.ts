'use server';
import { Contest } from '@/domain/Contest.schema';
import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { ContestStatusType } from '@/domain/ContestStatus.enum';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = createActionLogger('callChangeContestStatus');

/**
 * Change the status of an existing contest.
 * 
 * @param contest - The contest to change the status.
 * @param newStatus - The new status to set for the contest.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function callChangeContestStatus(contest: Contest, newStatus: ContestStatusType) {
  const session = await auth();
  if (isOpener(session) === false) {
    throw new Error('You must be Admin or Opener to perform this action. User id: ' + session?.user?.id);
  }
  
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
