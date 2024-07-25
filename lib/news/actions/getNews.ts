'use server'
import { News } from "@/domain/News.schema";
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient()

/**
 * Retrieves all active news.
 * @returns A promise that resolves to an array of active news ordered by date.
 */
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