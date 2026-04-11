'use server';
import prisma from '@/prisma';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('getAllUsersWithContests');

/**
 * Retrieves all users and their contest participation.
 * @returns A Promise that resolves to an array of users with their contest participation.
 */
export async function getAllUsersWithContests() {
  logger.start();
  try {
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

    logger.success({ userCount: users.length });
    return users;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
