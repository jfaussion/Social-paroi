'use server';
import prisma from '@/prisma';
import { Contest } from '@/domain/Contest.schema';
import { auth } from '@/auth';
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRoleEnum } from '@/domain/LocationRole.enum';
import { ContestStatusType } from '@/domain/ContestStatus.enum';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('callChangeContestStatus');

/**
 * Change the status of an existing contest.
 * 
 * @param contest - The contest to change the status.
 * @param newStatus - The new status to set for the contest.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function callChangeContestStatus(contest: Contest, newStatus: ContestStatusType, locationId: number) {
  const session = await auth();
  const hasRole = await checkUserLocationRole(session?.user?.id!, locationId, LocationRoleEnum.Enum.opener);
  if (!hasRole) {
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
