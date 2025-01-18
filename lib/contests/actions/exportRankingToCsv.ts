'use server';

import { PrismaClient } from '@prisma/client/edge';
import { auth } from '@/auth';
import { isOpener } from '@/utils/session.utils';
import { ContestRankingType } from '@/domain/ContestRankingType.enum';

const prisma = new PrismaClient();

export async function exportRankingToCsv(contestId: number, type: ContestRankingType): Promise<string> {
  const user = await auth();
  if (!isOpener(user)) {
    throw new Error('Only openers can export rankings');
  }

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