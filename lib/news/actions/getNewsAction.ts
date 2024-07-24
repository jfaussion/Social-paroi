'use server'
import { News } from "@/domain/News.schema";
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient()

export async function getAllActiveNews(): Promise<News[]> {
  try {
    const activeNews = await prisma.news.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return activeNews;
  } catch (err) {
    console.error('Error fetching active news', err);
    return [];
  }
}