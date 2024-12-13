'use server';
import { PrismaClient } from '@prisma/client/edge';
import { Gender } from '@/domain/ContestUser.schema';

const prisma = new PrismaClient();

/**
 * Adds a user to a contest using the ContestUser join table.
 * 
 * @param contestId - The ID of the contest.
 * @param gender - The gender of the user.
 * @param userId - The ID of the user to add.
 * @param name - The name of the user.
 * @returns A Promise that resolves to the ID of the created ContestUser, or null if an error occurs.
 */
export async function addContestUser(
  contestId: number,
  gender: Gender,
  userId?: string,
  name?: string
): Promise<number | null> {
  try {
    const contestUser = await prisma.contestUser.create({
      data: {
        contestId: contestId,
        userId: userId ?? null,
        gender: gender,
        name: name ?? null,
        isTemp: !!name,
      },
    });
    return contestUser.id;
  } catch (err) {
    console.error('Error adding user to contest', err);
    return null;
  }
} 