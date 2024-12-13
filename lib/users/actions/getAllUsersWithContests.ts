'use server';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

/**
 * Retrieves all users and their contest participation.
 * @returns A Promise that resolves to an array of users with their contest participation.
 */
export async function getAllUsersWithContests() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      contestUsers: { // Use the contestUsers relation
        select: {
          contest: { // Access the contest details
            select: {
              id: true,
              name: true,
              date: true, // Assuming you want the contest date as well
            },
          },
          isTemp: true, // Include any additional fields you need from ContestUser
        },
      },
    },
  });

  return users;
}