'use server'
import { auth } from "@/auth";
import { News } from "@/domain/News.schema";
import { isOpener } from "@/utils/session.utils";
import { PrismaClient } from '@prisma/client/edge';
import { createActionLogger } from '@/utils/logger';

const prisma = new PrismaClient()
const logger = createActionLogger('postNews');

/**
 * Create a new news or update an existing one.
 * 
 * @param news - The news to be posted.
 * @returns A promise that resolves to the posted news.
 * @throws Error - If the user is not an Admin or Opener.
 */
export async function postNews(news: News): Promise<News | null> {
  const user = await auth();
  if (isOpener(user) === false) {
    const error = new Error('You must be Admin or Opener to perform this action.');
    logger.error(error, { userId: user?.user?.id, newsId: news.id });
    throw error;
  }

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
        userId: user?.user?.id,
        date: new Date(),
        deleted: false,
      },
      create: {
        title: news.title,
        content: news.content,
        userId: user?.user?.id,
        date: new Date(),
        deleted: false,
      },
    });
    logger.success({ newsId: newNews.id, userId: user?.user?.id });
    return newNews;
  } catch (err) {
    logger.error(err, { newsId: news.id, userId: user?.user?.id });
    return null;
  }
}
