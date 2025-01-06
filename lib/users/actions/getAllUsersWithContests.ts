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
      contestUsers: {
        select: {
          isTemp: true,
          contest: {
            select: {
              id: true,
              name: true,
              date: true,
            },
          },
        },
      },
    },
  });

  return users;
}