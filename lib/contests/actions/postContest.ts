'use server'
import prisma from '@/prisma';
import { auth } from "@/auth";
import { Contest } from "@/domain/Contest.schema"; // Adjust the import based on your schema
import { checkUserLocationRole } from '@/lib/locations/actions/checkUserLocationRole';
import { LocationRoleEnum } from '@/domain/LocationRole.enum';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('postContest');

/**
 * Create a new contest or update an existing one.
 * 
 * @param contest - The contest to be posted.
 * @returns A promise that resolves to the posted contest.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function postContest(contestId: number, contest: FormData, locationId: number): Promise<Contest | null> {
  const user = await auth();
  const hasRole = await checkUserLocationRole(user?.user?.id!, locationId, LocationRoleEnum.Enum.opener);
  if (!hasRole) {
    const error = new Error('You must be Admin or Opener to perform this action.');
    logger.error(error, { contestId, userId: user?.user?.id });
    throw error;
  }

  try {
    const name = contest.get('name') as string;
    const dateValue = contest.get('date') as string;
    const coverImage = contest.get('coverImageUrl') as string;
    const targetId = contestId ?? -1;
    logger.start({
      contestId: targetId,
      hasCoverImage: Boolean(coverImage),
      hasDate: Boolean(dateValue),
    });

    const newContest = await prisma.contest.upsert({
      where: { 
        id: targetId, // Use -1 for new contests
      },
      update: {
        name,
        date: new Date(dateValue),
        coverImage,
      },
      create: {
        name,
        date: new Date(dateValue),
        coverImage,
        locationId,
      },
    });
    logger.success({ contestId: newContest.id, hasCoverImage: Boolean(newContest.coverImage) });
    return newContest as Contest;
  } catch (err) {
    logger.error(err, { contestId });
    return null;
  }
}
