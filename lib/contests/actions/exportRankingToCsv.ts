'use server';

import prisma from '@/prisma';
import { ContestRankingType } from '@/domain/ContestRankingType.enum';
import { createActionLogger } from '@/utils/logger';
const logger = createActionLogger('exportRankingToCsv');

export async function exportRankingToCsv(contestId: number, type: ContestRankingType): Promise<string> {
  logger.start({ contestId, type });
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

    logger.success({ contestId, type });
    return ranking.csvContent;
  } catch (error) {
    logger.error(error, { contestId, type });
    throw error;
  }
} 
