'use server'
import { auth } from "@/auth";
import { Contest } from "@/domain/Contest.schema"; // Adjust the import based on your schema
import { isOpener } from "@/utils/session.utils";
import { PrismaClient } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient();
const logger = createActionLogger('postContest');

/**
 * Create a new contest or update an existing one.
 * 
 * @param contest - The contest to be posted.
 * @returns A promise that resolves to the posted contest.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function postContest(contestId: number, contest: FormData): Promise<Contest | null> {
  const user = await auth();
  if (isOpener(user) === false) {
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
      },
    });
    logger.success({ contestId: newContest.id, hasCoverImage: Boolean(newContest.coverImage) });
    return newContest as Contest;
  } catch (err) {
    logger.error(err, { contestId });
    return null;
  }
}
