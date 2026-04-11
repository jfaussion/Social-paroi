'use server'
import prisma from '@/prisma';
import { auth } from "@/auth";
import { isOpener } from "@/utils/session.utils";
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('markNewsAsDeleted');

/**
 * Marks a news as deleted.
 * 
 * @param newsId - The news id.
 * @throws Error - If the user is not an Admin.
 */
export async function markNewsAsDeleted(newsId: number) {
  const user = await auth();
  if (isOpener(user) === false) {
    const error = new Error('You must be an admin to perform this action.');
    logger.error(error, { newsId, userId: user?.user?.id });
    throw error;
  }

  try {
    logger.start({ newsId });
    await prisma.news.update({
      where: { id: newsId },
      data: {
        deleted: true,
      },
    });

    logger.success({ newsId });
  } catch (err) {
    logger.error(err, { newsId });
  }
}
