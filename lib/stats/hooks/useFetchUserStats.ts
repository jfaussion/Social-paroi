import { useState } from 'react';
import { getUserStats } from '../actions/getUserStats';

export const useFetchUserStats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats(userId: string): Promise<any> {
    setIsLoading(true);
    setError(null);
    try {
      const userStats = await getUserStats(userId);
      setIsLoading(false);
      return userStats;
    } catch (err) {
      setError('An error occurred while fetching the user stats');
      setIsLoading(false);
      return [];
    }
  };

  return { fetchStats, isLoading, error };
};
