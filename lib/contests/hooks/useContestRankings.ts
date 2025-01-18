'use client';

import { useState } from 'react';
import { generateContestRankings } from '../actions/generateContestRankings';
import { exportRankingToCsv } from '../actions/exportRankingToCsv';
import { ContestRankingType } from '@/domain/ContestRankingType.enum';

interface UseContestRankingsReturn {
  isGenerating: boolean;
  isExporting: boolean;
  generateError: string | null;
  exportError: string | null;
  generateRankings: (contestId: number) => Promise<boolean>;
  exportRanking: (contestId: number, type: ContestRankingType) => Promise<string | null>;
  resetErrors: () => void;
}

export function useContestRankings(): UseContestRankingsReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const resetErrors = () => {
    setGenerateError(null);
    setExportError(null);
  };

  const generateRankings = async (contestId: number): Promise<boolean> => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const success = await generateContestRankings(contestId);
      if (!success) {
        setGenerateError('Failed to generate rankings');
        return false;
      }
      return true;
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : 'Failed to generate rankings');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const exportRanking = async (contestId: number, type: ContestRankingType): Promise<string | null> => {
    setIsExporting(true);
    setExportError(null);
    try {
      const csvContent = await exportRankingToCsv(contestId, type);
      return csvContent;
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Failed to export ranking');
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isGenerating,
    isExporting,
    generateError,
    exportError,
    generateRankings,
    exportRanking,
    resetErrors,
  };
} 