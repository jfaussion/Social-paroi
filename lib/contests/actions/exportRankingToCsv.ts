'use server';

import { PrismaClient } from '@prisma/client/edge';
import { ContestRankingType } from '@/domain/ContestRankingType.enum';

const prisma = new PrismaClient();

export async function exportRankingToCsv(contestId: number, type: ContestRankingType): Promise<string> {
  try {
    const ranking = await prisma.contestRanking.findFirst({
      where: {
        contestId,
        type
      },
      select: {
        csvContent: true
      }
    });

    if (!ranking) {
      throw new Error('Ranking not found');
    }

    return ranking.csvContent;
  } catch (error) {
    console.error('Error exporting ranking to CSV:', error);
    throw error;
  }
} 