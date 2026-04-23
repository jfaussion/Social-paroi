import { useState, useCallback } from 'react';
import { getDifficultyLevels } from '../actions/manageDifficultyLevels';

export type DifficultyLevel = {
  id: number;
  name: string;
  color: string | null;
  points: number;
  order: number;
};

export const useFetchDifficultyLevels = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDifficultyLevels = useCallback(async (locationId: number): Promise<DifficultyLevel[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const levels = await getDifficultyLevels(locationId);
      setIsLoading(false);
      return levels;
    } catch (err) {
      setError('Failed to fetch difficulty levels');
      setIsLoading(false);
      return [];
    }
  }, []);

  return { fetchDifficultyLevels, isLoading, error };
};