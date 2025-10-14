'use server'
import { News } from "@/domain/News.schema";
import { PrismaClient } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient()
const logger = createActionLogger('getAllActiveNews');

/**
 * Retrieves all active news.
 * @returns A promise that resolves to an array of active news ordered by date.
 */
export async function getAllActiveNews(): Promise<News[]> {
  logger.start();
  try {
    const activeNews = await prisma.news.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        date: 'desc',
      },
    });
    logger.success({ newsCount: activeNews.length });
    return activeNews;
  } catch (err) {
    logger.error(err);
    return [];
  }
}
