'use server'
import { auth } from "@/auth";
import { isOpener } from "@/utils/session.utils";
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient()

export async function deleteNewsAction(newsId: number) {
  const user = await auth();
  if (isOpener(user) === false) {
    throw new Error('You must be an admin to perform this action. User: \n' + user);
  }

  try {
    await prisma.news.update({
      where: { id: newsId },
      data: {
        deleted: true,
      },
    });

    console.log('News marked as deleted, id:', newsId);
  } catch (err) {
    console.error('Error marking the news as deleted', err);
  }
}