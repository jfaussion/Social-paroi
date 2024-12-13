'use server';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

/**
 * Removes a user from a contest using the ContestUser join table.
 * 
 * @param contestUserId - The ID of the ContestUser to remove.
 * @returns A Promise that resolves to true if the user was removed successfully, or false if an error occurs.
 */
export async function removeContestUser(contestUserId: number): Promise<boolean> {
  try {
    await prisma.contestUser.deleteMany({
      where: {
        id: contestUserId,
      },
    });
    return true;
  } catch (err) {
    console.error('Error removing user from contest', err);
    return false;
  }
} 