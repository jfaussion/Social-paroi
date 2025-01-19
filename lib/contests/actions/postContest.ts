'use server'
import { auth } from "@/auth";
import { Contest } from "@/domain/Contest.schema"; // Adjust the import based on your schema
import { isOpener } from "@/utils/session.utils";
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

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
    throw new Error('You must be Admin or Opener to perform this action. User: \n' + user);
  }

  try {
    const newContest = await prisma.contest.upsert({
      where: { 
        id: contestId ?? -1, // Use -1 for new contests
      },
      update: {
        name: contest.get('name') as string,
        date: new Date(contest.get('date') as string),
        coverImage: contest.get('coverImageUrl') as string,
      },
      create: {
        name: contest.get('name') as string,
        date: new Date(contest.get('date') as string),
        coverImage: contest.get('coverImageUrl') as string,
      },
    });
    return newContest as Contest;
  } catch (err) {
    console.error('Error creating/updating contest', err);
    return null;
  }
}