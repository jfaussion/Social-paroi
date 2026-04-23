'use server'
import prisma from '@/prisma';
import { Contest } from "@/domain/Contest.schema";
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('postContest');

export async function postContest(contestId: number, contest: FormData, locationId: number): Promise<Contest | null> {
  await checkRoleOrThrow({ locationId, actionName: 'create or update contest' });

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
        id: targetId,
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
