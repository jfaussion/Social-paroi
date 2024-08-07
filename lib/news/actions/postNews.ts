'use server'
import { auth } from "@/auth";
import { News } from "@/domain/News.schema";
import { isOpener } from "@/utils/session.utils";
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient()

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
    throw new Error('You must be Admin or Opener to perform this action. User: \n' + user);
  }

  try {
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
    return newNews;
  } catch (err) {
    console.error('Error creating/updating news', err);
    return null;
  }
}