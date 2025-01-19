'use server';
import { Contest } from '@/domain/Contest.schema';
import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { ContestStatusType } from '@/domain/ContestStatus.enum';

const prisma = new PrismaClient();

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
  
  try {
    await prisma.contest.update({
      where: {
        id: contest.id
      },
      data: {
        status: newStatus
      }
    });

    console.log('Contest status updated, id:', contest.id, 'name:', contest.name, 'newStatus', newStatus);
  } catch (err) {
    console.error('Error updating the contest status', err);
  }
}