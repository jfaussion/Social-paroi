'use server'
import prisma from '@/prisma';
import { News } from "@/domain/News.schema";
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('getAllActiveNews');

/**
 * Retrieves all active news.
 * @returns A promise that resolves to an array of active news ordered by date.
 */
export async function getAllActiveNews(locationId: number): Promise<News[]> {
  logger.start();
  try {
    const activeNews = await prisma.news.findMany({
      where: {
        deleted: false,
        locationId,
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
