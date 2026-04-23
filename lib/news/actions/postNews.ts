'use server'
import prisma from '@/prisma';
import { News } from "@/domain/News.schema";
import { checkRoleOrThrow } from '@/lib/shared/checkRoleOrThrow';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('postNews');

export async function postNews(news: News, locationId: number): Promise<News | null> {
  const userId = await checkRoleOrThrow({ locationId, actionName: 'create or update news' });

  try {
    logger.start({
      newsId: news.id ?? null,
      titleLength: news.title.length,
      hasContent: Boolean(news.content),
    });
    const newNews = await prisma.news.upsert({
      where: { 
        id: news.id ?? -1,
       },
      update: {
        title: news.title,
        content: news.content,
        userId,
        date: new Date(),
        deleted: false,
      },
      create: {
        title: news.title,
        content: news.content,
        userId,
        date: new Date(),
        deleted: false,
        locationId,
      },
    });
    logger.success({ newsId: newNews.id, userId });
    return newNews;
  } catch (err) {
    logger.error(err, { newsId: news.id, userId });
    return null;
  }
}
