import { useState } from 'react';
import { getUserRankings } from '../actions/getUserRanking';

export const useFetchRanking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRanking(): Promise<any> {
    setIsLoading(true);
    setError(null);
    try {
      const ranking = await getUserRankings();
      setIsLoading(false);
      return ranking;
    } catch (err) {
      setError('An error occurred while fetching the ranking');
      setIsLoading(false);
      return [];
    }
  };

  return { fetchRanking, isLoading, error };
};
