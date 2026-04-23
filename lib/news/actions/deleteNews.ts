'use server'
import prisma from '@/prisma';
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('markNewsAsDeleted');

export async function markNewsAsDeleted(newsId: number, locationId: number) {
  await checkRoleOrThrow({ locationId, actionName: 'delete news' });

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
